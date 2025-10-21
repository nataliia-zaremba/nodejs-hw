import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Встановлюємо from з env або з переданих опцій
  const mailOptions = {
    from: process.env.SMTP_FROM || options.from,
    ...options,
  };

  return await transporter.sendMail(mailOptions);
};
