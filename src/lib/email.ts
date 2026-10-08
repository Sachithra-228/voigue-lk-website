import nodemailer from "nodemailer";

/** Sends a plain-text notification. Silently skipped when email is not configured. `to` overrides EMAIL_TO. */
export async function sendNotification(subject: string, text: string, to?: string) {
  const server = process.env.EMAIL_SERVER;
  const from = process.env.EMAIL_FROM;
  const recipient = to || process.env.EMAIL_TO;
  if (!server || !from || !recipient) return;

  const transporter = nodemailer.createTransport(server);
  await transporter.sendMail({ from, to: recipient, subject, text });
}
