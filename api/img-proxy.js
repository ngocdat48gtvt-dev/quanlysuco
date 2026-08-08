// Proxy ảnh Firebase Storage về cùng origin để client đọc được bytes (tránh CORS).
// Dùng cho tính năng ghép ảnh vào file Word trên web điều hành.

const ALLOWED_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);
const PROJECT_BUCKETS = new Set([
  "quanlysuco-6797e.firebasestorage.app",
  "quanlysuco-6797e.appspot.com",
]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function targetsProjectBucket(url) {
  const host = url.hostname.toLowerCase();
  if (PROJECT_BUCKETS.has(host)) return true;
  if (host === "firebasestorage.googleapis.com") {
    const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o(?:\/|$)/);
    return !!match && PROJECT_BUCKETS.has(decodeURIComponent(match[1]));
  }
  if (host === "storage.googleapis.com") {
    const bucket = url.pathname.split("/").filter(Boolean)[0] || "";
    return PROJECT_BUCKETS.has(decodeURIComponent(bucket));
  }
  return false;
}

function isAllowedHost(host) {
  if (ALLOWED_HOSTS.has(host)) return true;
  // bucket dạng mới: <project>.firebasestorage.app / *.appspot.com
  return host.endsWith(".firebasestorage.app") || host.endsWith(".appspot.com");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const raw = req.query?.url;
  const target = Array.isArray(raw) ? raw[0] : raw;
  if (!target) {
    return res.status(400).json({ error: "Thiếu tham số url" });
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return res.status(400).json({ error: "URL không hợp lệ" });
  }

  if (
    parsed.protocol !== "https:" ||
    !isAllowedHost(parsed.hostname) ||
    !targetsProjectBucket(parsed)
  ) {
    return res.status(403).json({ error: "Host không được phép" });
  }

  try {
    const upstream = await fetch(parsed.toString(), { signal: AbortSignal.timeout(15000) });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Tải ảnh thất bại" });
    }
    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.toLowerCase().startsWith("image/")) {
      return res.status(415).json({ error: "Chỉ cho phép nội dung hình ảnh" });
    }
    const declaredSize = Number(upstream.headers.get("content-length")) || 0;
    if (declaredSize > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: "Ảnh vượt quá giới hạn 10 MB" });
    }
    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: "Ảnh vượt quá giới hạn 10 MB" });
    }
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).end(buffer);
  } catch (err) {
    console.error("img-proxy error:", err);
    return res.status(502).json({ error: "Lỗi tải ảnh" });
  }
};
