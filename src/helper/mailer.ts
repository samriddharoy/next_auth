import nodemailer from "nodemailer";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

interface SendEmailProps {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailProps) => {
  try {
    // Hash the userId to create a token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update the user model with token and expiry
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
  verificationToken: hashedToken,
  verificationTokenExpiry: Date.now() + 3600000,
});
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    // Construct URL
    const domain = process.env.DOMAIN || "http://localhost:3000";
    const url =
      emailType === "VERIFY"
        ? `${domain}/verifyemail?token=${hashedToken}`
        : `${domain}/resetpassword?token=${hashedToken}`;

    // Email content
    const mailOptions = {
      from: '"Sammy" <sammy@gmail.com>',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${url}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.<br/>Or paste this link in your browser:<br/>${url}</p>`,
    };

    // Send email
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent:", response.messageId);
    return response;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};
