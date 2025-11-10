import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    // In development, fall back to an Ethereal test account so emails still work
    console.warn(
      "EMAIL_USER or EMAIL_PASS not set. Falling back to an Ethereal test account for sending emails."
    );
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail(to: string, subject: string, text: string) {
  const tx = await getTransporter();

  if (!tx) throw new Error("No mail transporter available");

  const mailOptions = {
    from: process.env.EMAIL_USER || 'no-reply@gmail.com',
    to,
    subject,
    text,
  };

  try {
    const info = await tx.sendMail(mailOptions);
    // If using Ethereal, log a preview URL to help debugging in dev
    if ((info as any).messageId && (nodemailer as any).getTestMessageUrl) {
      // getTestMessageUrl may be undefined in some nodemailer versions; guard it
      const preview = (nodemailer as any).getTestMessageUrl
        ? (nodemailer as any).getTestMessageUrl(info)
        : null;
      if (preview) console.info("Preview URL:", preview);
    }
    return info;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}
