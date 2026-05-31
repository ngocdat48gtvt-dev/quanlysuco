function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatMessage(data) {
  const lines = [
    "🆕 <b>Khách đăng ký mới — Landing Page</b>",
    "",
    `<b>Họ tên:</b> ${escapeHtml(data.name)}`,
    `<b>SĐT:</b> ${escapeHtml(data.phone)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
  ];
  if (data.company) lines.push(`<b>Công ty:</b> ${escapeHtml(data.company)}`);
  lines.push(`<b>Địa chỉ:</b> ${escapeHtml(data.province)}`);
  if (data.note) lines.push(`<b>Ghi chú:</b> ${escapeHtml(data.note)}`);
  return lines.join("\n");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(503).json({ error: "Telegram chưa cấu hình trên Vercel" });
  }

  const body = req.body || {};
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const province = String(body.province || "").trim();

  if (name.length < 2 || phone.length < 9 || email.length < 5 || province.length < 2) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }

  const payload = {
    name,
    phone,
    email,
    company: String(body.company || "").trim(),
    province,
    note: String(body.note || "").trim(),
  };

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatMessage(payload),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      const detail = await tgRes.text();
      console.error("Telegram API error:", detail);
      return res.status(502).json({ error: "Gửi Telegram thất bại" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram notify error:", err);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
