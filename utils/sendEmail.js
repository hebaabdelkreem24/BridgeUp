import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // 1) Create transporter like ("Gmail","mailtrap")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    // if secure false port = 587, if true port = 465
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define email options (like from, to ,subject, email content)
  const mailOptions = {
    from: `BridgeUp <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  // 3) Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
