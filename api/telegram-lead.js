function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatMessage(data) {
  const isPurchase = data.leadType === "purchase";
  const isConsultation = data.leadType === "consultation";
  const lines = [
    isPurchase
      ? "🛒 <b>Khách MUA phần mềm — chờ chuyển khoản</b>"
      : isConsultation
        ? "📋 <b>Đăng ký tư vấn — Landing Page</b>"
        : "🆕 <b>Khách đăng ký mới — Landing Page</b>",
    "",
    `<b>Họ tên:</b> ${escapeHtml(data.name)}`,
    `<b>SĐT:</b> ${escapeHtml(data.phone)}`,
  ];
  if (data.email) lines.push(`<b>Email:</b> ${escapeHtml(data.email)}`);
  const productLabel = String(data.product || data.company || "").trim();
  if (productLabel) lines.push(`<b>Loại phần mềm:</b> ${escapeHtml(productLabel)}`);
  if (data.company && isConsultation) {
    lines.push(`<b>Đơn vị:</b> ${escapeHtml(data.company)}`);
  }
  if (data.province && !isConsultation) {
    lines.push(`<b>Địa chỉ:</b> ${escapeHtml(data.province)}`);
  }
  if (isPurchase && data.transferNote) {
    lines.push(`<b>Nội dung CK:</b> ${escapeHtml(data.transferNote)}`);
  }
  if (isPurchase && data.amount != null) {
    lines.push(`<b>Số tiền:</b> ${escapeHtml(String(data.amount))} VNĐ`);
  }
  if (data.note) lines.push(`<b>Ghi chú:</b> ${escapeHtml(data.note)}`);
  return lines.join("\n");
}

function telegramHint(apiText) {
  const t = String(apiText || "");
  if (t.includes("chat not found")) {
    return "Chat ID sai hoặc chưa bấm Start bot — lấy ID từ @userinfobot.";
  }
  if (t.includes("Unauthorized")) {
    return "Bot Token sai — tạo lại token từ @BotFather.";
  }
  return t.slice(0, 200);
}

function parseBody(req) {
  let body = req.body;
  if (body == null) return {};
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString("utf8"));
    } catch {
      return {};
    }
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const ok = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    return res.status(200).json({
      ok,
      message: ok
        ? "API sẵn sàng — gửi form landing page để nhận tin."
        : "Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trên Vercel → Redeploy.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = String(process.env.TELEGRAM_CHAT_ID || "").trim();

  if (!token || !chatId) {
    return res.status(503).json({
      error: "Telegram chưa cấu hình trên Vercel",
    });
  }

  const body = parseBody(req);
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const province = String(body.province || body.company || "").trim();
  const leadType = String(body.leadType || "trial").trim();

  if (name.length < 2 || phone.length < 9) {
    return res.status(400).json({
      error: "Dữ liệu không hợp lệ",
      received: { name: !!name, phone: !!phone },
    });
  }

  if (leadType !== "consultation" && (email.length < 5 || province.length < 2)) {
    return res.status(400).json({
      error: "Dữ liệu không hợp lệ",
      received: { name: !!name, phone: !!phone, email: !!email, province: !!province },
    });
  }

  const payload = {
    name,
    phone,
    email,
    company: String(body.company || body.product || "").trim(),
    product: String(body.product || body.company || "").trim(),
    province,
    note: String(body.note || "").trim(),
    leadType: String(body.leadType || "trial").trim(),
    transferNote: String(body.transferNote || "").trim(),
    amount: body.amount != null ? Number(body.amount) : null,
    needs: String(body.needs || "").trim(),
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

    const tgText = await tgRes.text();
    if (!tgRes.ok) {
      console.error("Telegram API:", tgText);
      return res.status(502).json({
        error: "Gửi Telegram thất bại",
        hint: telegramHint(tgText),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram notify error:", err);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
