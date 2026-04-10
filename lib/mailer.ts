import nodemailer from "nodemailer";

function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
}

function getFrom() {
  return process.env.SMTP_FROM?.replace(/^["']|["']$/g, "") ?? "eNtorno <contacto@entorno.agency>";
}

function buildHtml({ header, body, cta }: {
  header: string;
  body: string;
  cta?: { text: string; url: string };
}): string {
  const brandColor = "#1090E0";
  const ctaHtml = cta
    ? `<div style="margin:28px 0 0;"><a href="${cta.url}" style="display:inline-block;background:${brandColor};color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:15px;font-weight:600;">${cta.text} &rarr;</a></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);">
    <div style="background:${brandColor};padding:20px 32px;">
      <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-.5px;">eNtorno</span>
    </div>
    <div style="padding:28px 32px 0;"><h2 style="margin:0;font-size:19px;font-weight:700;color:#1e293b;">${header}</h2></div>
    <div style="padding:16px 32px 36px;">
      <p style="margin:0;font-size:15px;color:#475569;line-height:1.75;white-space:pre-wrap;">${body}</p>
      ${ctaHtml}
    </div>
  </div>
</body>
</html>`;
}

export async function sendContactNotification({
  name, email, phone, message, products,
}: {
  name: string; email: string; phone: string; message: string; products: string;
}) {
  const to = process.env.NOTIFICATION_EMAIL ?? "contacto@entorno.agency";
  const body = `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nProductos de interés: ${products || "No especificado"}\n\nMensaje:\n${message}`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: getFrom(),
    to,
    subject: `Nuevo contacto de ${name} — Bot Store`,
    text: body,
    html: buildHtml({ header: "Nuevo contacto — Bot Store", body: body.replace(/\n/g, "<br>") }),
  });
}

export async function sendBotLeadNotification({
  name, email, phone, messages, productsShown,
}: {
  name: string; email: string; phone: string;
  messages: { role: string; text: string }[];
  productsShown: string[];
}) {
  const to = process.env.NOTIFICATION_EMAIL ?? "contacto@entorno.agency";
  const contact = email || phone || "No proporcionado";
  const hasProducts = productsShown.length > 0;
  const tag = hasProducts ? "🛒 PRODUCTOS" : "💬 LEAD";

  const conversation = messages
    .filter(m => m.text?.length > 0)
    .slice(-10)
    .map(m => `${m.role === "user" ? "👤 Cliente" : "🤖 N"}: ${m.text.slice(0, 200)}`)
    .join("\n\n");

  const products = productsShown.length > 0
    ? `Productos mostrados: ${productsShown.join(", ")}`
    : "No se mostraron productos";

  const body = `${tag} — Nuevo lead del chat bot\n\nNombre: ${name}\nContacto: ${contact}\n${products}\n\n--- Conversación ---\n\n${conversation}`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: getFrom(),
    to,
    subject: `${tag} Chat Bot — ${name} ${hasProducts ? "(vio productos)" : ""}`,
    text: body,
    html: buildHtml({ header: `${tag} Nuevo lead del Chat Bot`, body: body.replace(/\n/g, "<br>") }),
  });
}
