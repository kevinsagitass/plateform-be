import { transporter } from "../config/email.config.js";

export const sendInviteEmail = async ({
  toEmail,
  inviterName,
  organizationName,
  role,
  inviteUrl,
}) => {
  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `You've been invited to join ${organizationName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're Invited!</h2>
        <p>
          <strong>${inviterName}</strong> has invited you to join
          <strong>${organizationName}</strong>. as a <strong>${role}</strong>
        </p>
        <p>Click the button below to accept the invitation and create your account.</p>
        <a
          href="${inviteUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #f97316;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 16px 0;
          "
        >
          Accept Invitation
        </a>
        <p style="color: #888; font-size: 12px;">
          This invitation link will expire in 7 days.
          If you did not expect this invitation, you can safely ignore this email.
        </p>
        <p style="color: #888; font-size: 12px;">
          Or copy this link: ${inviteUrl}
        </p>
      </div>
    `,
  });
};
