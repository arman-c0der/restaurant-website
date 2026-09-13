import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendVerificationEmail({
  email,
  name,
  token,
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const verificationUrl = `${appUrl}/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email address",
    html: 
      <div style="
        margin: 0;
        padding: 40px 20px;
        background: #f7f7f7;
        font-family: Arial, sans-serif;
      ">
        <div style="
          max-width: 520px;
          margin: 0 auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          border: 1px solid #eeeeee;
        ">
          <h1 style="
            margin: 0 0 16px;
            font-size: 28px;
            color: #111111;
          ">
            Verify your email
          </h1>

          <p style="
            margin: 0 0 12px;
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
          ">
            Hi ${name},
          </p>

          <p style="
            margin: 0 0 28px;
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
          ">
            Thanks for creating an account. Please verify your email
            address to continue.
          </p>

          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background: #111111;
              color: #ffffff;
              text-decoration: none;
              border-radius: 10px;
              font-size: 15px;
              font-weight: 600;
            "
          >
            Verify Email
          </a>

          <p style="
            margin: 28px 0 0;
            font-size: 13px;
            line-height: 1.6;
            color: #888888;
          ">
            This verification link will expire in 24 hours.
          </p>
        </div>
      </div>
    ,
  });
}