import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface SendResult {
  success: boolean;
  message?: string;
  info?: any;
  previewUrl?: string | null;
}

/**
 * Create a nodemailer transporter. If SMTP env vars are not configured,
 * create an Ethereal test account (for local development) and return a
 * transporter that uses it.
 */
async function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  // Fallback: create an Ethereal test account so emails can be previewed
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Send a welcome email to a new subscriber.
 * Requires SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS and EMAIL_FROM (optional).
 */
export async function sendWelcomeEmail(email: string, name?: string, profession?: string, confirmUrl?: string): Promise<SendResult> {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }

  const appName = process.env.APP_NAME || "Learn Drop";
  const appUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_URL || "https://learn-drop.example.com";
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_USER || `support@${appUrl.replace(/^https?:\/\//, "")}`;
  const logoUrl = process.env.EMAIL_LOGO_URL || `${appUrl.replace(/\/$/, "")}/logo.png`;
    const logoPath = process.env.EMAIL_LOGO_PATH || path.join(process.cwd(), "public", "placeholder-logo.png");

    const from = process.env.EMAIL_FROM || `"${appName}" <no-reply@${appUrl.replace(/^https?:\/\//, "")}>`;
    const professionLabel = profession ? profession : "builder";
    const subject = `Please confirm your subscription to ${appName}`;

    const textLines: string[] = []
    textLines.push(`Hi ${name || "there"},`)
    textLines.push("")
    textLines.push(`Thanks for signing up for ${appName}.`) 
    if (confirmUrl) {
      textLines.push("")
      textLines.push(`Please confirm your email by visiting the link below:`)
      textLines.push(confirmUrl)
    } else {
      textLines.push("")
      textLines.push(`To start receiving the newsletter, please confirm your email via your email provider's confirmation message.`)
    }
    textLines.push("")
    textLines.push("If you don't see the confirmation email, check your spam folder or reply to this message and we'll help you get set up.")
    textLines.push("")
    textLines.push(`Questions? Contact us at ${supportEmail}.`)
    textLines.push("")
    textLines.push(`Thanks,`)
    textLines.push(`${appName} Team`)
    const text = textLines.join("\n")

    // Decide whether to use inline CID, data URI, or remote URL for the logo.
    // Priority (best effort): CID (when attaching file) -> data URI (inline) -> remote URL
    let logoImgSrc = logoUrl;
    let logoDataUri: string | null = null;
    let useCid = false;
    try {
      if (logoPath && fs.existsSync(logoPath)) {
        const buffer = fs.readFileSync(logoPath);
        const ext = path.extname(logoPath).toLowerCase();
        let mime = 'image/png';
        if (ext === '.svg') mime = 'image/svg+xml';
        else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
        else if (ext === '.gif') mime = 'image/gif';
        const base64 = buffer.toString('base64');
        logoDataUri = `data:${mime};base64,${base64}`;
        // Prefer CID when we will attach the file — many email clients render CIDs reliably.
        useCid = true;
        logoImgSrc = `cid:learn-drop-logo`;
      } else if (logoDataUri) {
        // If we somehow have a data URI but no file, use that.
        logoImgSrc = logoDataUri
      } else {
        logoImgSrc = logoUrl
      }
    } catch (e) {
      // If anything goes wrong reading the file, fall back to remote URL
      logoImgSrc = logoUrl;
      logoDataUri = null;
      useCid = false;
    }

    const html = `
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <style>
        /* Mobile-first responsive styles */
        /* Prevent some email clients (Gmail, Yahoo) from collapsing quoted text
           by forcing blockquote/gmail_quote to be visible. Some clients rewrite
           HTML, but inline '!important' rules increase the chance content stays visible. */
        blockquote, .gmail_quote, .yahoo_quoted { display: block !important; max-height: none !important; visibility: visible !important; }
        blockquote { border-left: 4px solid rgba(0,0,0,0.05); margin: 0 0 12px 0; padding: 8px 12px; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin:0; padding:0; background:#f6f9fc; color:#0f172a; }
        .email-wrap { width:100%; max-width:680px; margin:0 auto; padding:24px; }
    .card { background:#ffffff; border-radius:12px; padding:24px; box-shadow:0 8px 30px rgba(16,24,40,0.06); }
    .hero { background: linear-gradient(135deg,#0ea5e9 0%,#7c3aed 100%); color: #fff; padding:22px; border-radius:8px; text-align:left; }
    .header { text-align:left; margin-bottom:12px; }
    h1 { font-size:20px; margin:8px 0 6px; color:inherit; }
        p { margin:12px 0; line-height:1.6; color:#334155; }
    .btn { display:inline-block; padding:12px 20px; background:#0f172a; color:#fff; border-radius:8px; text-decoration:none; font-weight:700; }
    .muted { color:#64748b; font-size:13px; }
        .footer { text-align:left; margin-top:18px; font-size:13px; color:#94a3b8; }
        ul { margin:8px 0 12px 20px; }
      </style>
    </head>
    <body>
      <div class="email-wrap">
        <div class="card">
              <div class="header">
              </div>
          <div class="hero">
            <h1>Please confirm your subscription</h1>
            <p style="margin:8px 0 14px; opacity:0.95; color: #ffffff;">We just received a request to subscribe <strong>${email}</strong> to ${appName}.</p>
            ${confirmUrl ? `<p style="margin-top:12px"><a href="${confirmUrl}" class="btn">Confirm subscription</a></p>` : ''}
          </div>

          <div style="padding:14px 0 0">
            <p style="margin:0 0 12px">Why confirm?</p>
            <ul>
              <li><strong>Verify your inbox</strong> so we only send newsletters to people who want them.</li>
              <li><strong>Protect your privacy</strong> — we never sell or share your email.</li>
              <li><strong>Unsubscribe anytime</strong> using the link in every issue.</li>
            </ul>
            <p style="margin-top:8px">If you don't see the confirmation email, check your spam folder or reply to this email and we'll help.</p>
            <p style="margin-top:12px"><a href="${appUrl}" class="btn">Visit Learn Drop</a></p>
          </div>

          <p class="muted">Questions? Contact <a href="mailto:${supportEmail}">${supportEmail}</a></p>

          <div class="footer">
            <p class="muted">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

  try {
    const transporter = await createTransporter();

    // Prepare attachments: embed logo as inline CID if file exists
    const attachments: Array<any> = [];
    try {
      if (useCid && logoPath && fs.existsSync(logoPath)) {
        attachments.push({ filename: path.basename(logoPath), path: logoPath, cid: 'learn-drop-logo' });
      }
    } catch (e) {
      // ignore file system errors and continue without inline logo
    }

    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      text,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    // Try to get a preview URL for Ethereal (dev-only)
    let previewUrl: string | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodemailerLib = require("nodemailer");
      if (nodemailerLib && typeof nodemailerLib.getTestMessageUrl === "function") {
        previewUrl = nodemailerLib.getTestMessageUrl(info) || null;
      }
    } catch (e) {
      previewUrl = null;
    }

    console.log("📧 Welcome email sent", { to: email, messageId: info.messageId, previewUrl });

    return { success: true, info, previewUrl };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, message: (error instanceof Error) ? error.message : String(error) };
  }
}

export default sendWelcomeEmail;

export async function sendNewsletter(options: {
  subject: string
  html?: string
  text?: string
  imageData?: string | null // data URI
  imageName?: string | null
  recipients: Array<string | { email: string; name?: string; profession?: string }>
}) {
  const { subject, html, text, imageData, imageName, recipients } = options
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return { success: false, message: "No recipients provided" }
  }

  try {
    const transporter = await createTransporter()

    const attachmentsBase: any[] = []
    if (imageData) {
      const m = /^data:(.+);base64,(.+)$/.exec(imageData)
      if (m) {
        const mime = m[1]
        const b64 = m[2]
        const content = Buffer.from(b64, 'base64')
        attachmentsBase.push({ filename: imageName || 'image', content, cid: 'newsletter-image', contentType: mime })
      }
    }

    const sent: string[] = []
    const errors: Array<{ to: string; error: any }> = []

    // Send one-by-one so we can personalize per recipient
    for (const r of recipients) {
      const to = typeof r === 'string' ? r : r.email
      const recipientName = typeof r === 'string' ? undefined : r.name
      const recipientProfession = typeof r === 'string' ? undefined : r.profession

      try {
        // Personalize HTML/text by replacing {{name}} and {{profession}} tokens
        let personalizedHtml = html || undefined
        let personalizedText = text || undefined
        if (personalizedHtml && (recipientName || recipientProfession)) {
          personalizedHtml = personalizedHtml.replace(/{{\s*name\s*}}/gi, recipientName || '')
          personalizedHtml = personalizedHtml.replace(/{{\s*profession\s*}}/gi, recipientProfession || '')
        }
        if (personalizedText && (recipientName || recipientProfession)) {
          personalizedText = personalizedText.replace(/{{\s*name\s*}}/gi, recipientName || '')
          personalizedText = personalizedText.replace(/{{\s*profession\s*}}/gi, recipientProfession || '')
        }

        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"${process.env.APP_NAME || 'Learn Drop'}" <no-reply@${(process.env.NEXT_PUBLIC_APP_URL || 'learn-drop.example.com').replace(/^https?:\/\//, '')}>`,
          to,
          subject,
          text: personalizedText || undefined,
          html: personalizedHtml || undefined,
          attachments: attachmentsBase.length ? attachmentsBase : undefined,
        })
        sent.push(to)
      } catch (err) {
        errors.push({ to, error: err })
      }
    }

    console.log(`Sent newsletter to ${sent.length}/${recipients.length} recipients`, { sentCount: sent.length, errors: errors.length })
    return { success: true, sentCount: sent.length, errors }
  } catch (err) {
    console.error('Failed to send newsletter:', err)
    return { success: false, message: (err instanceof Error) ? err.message : String(err) }
  }
}
