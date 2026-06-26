// Proxy ảnh Firebase Storage về cùng origin để client đọc được bytes (tránh CORS).
// Dùng cho tính năng ghép ảnh vào file Word trên web điều hành.

const ALLOWED_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);

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

  if (parsed.protocol !== "https:" || !isAllowedHost(parsed.hostname)) {
    return res.status(403).json({ error: "Host không được phép" });
  }

  try {
    const upstream = await fetch(parsed.toString());
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Tải ảnh thất bại" });
    }
    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).end(buffer);
  } catch (err) {
    console.error("img-proxy error:", err);
    return res.status(502).json({ error: "Lỗi tải ảnh" });
  }
};
