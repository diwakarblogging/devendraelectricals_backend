import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"${config.site.name}" <${config.smtp.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
};

export const sendInquiryNotification = async (inquiry: {
  name: string;
  email?: string;
  phone: string;
  message: string;
  productName?: string;
}): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #f59e0b; color: #000; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f9fafb; }
      .field { margin-bottom: 15px; }
      .label { font-weight: bold; color: #6b7280; }
      .value { color: #111827; }
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h2> New Inquiry Received</h2></div>
        <div class="content">
          <div class="field"><div class="label">Name</div><div class="value">${inquiry.name}</div></div>
          ${inquiry.email ? `<div class="field"><div class="label">Email</div><div class="value">${inquiry.email}</div></div>` : ''}
          <div class="field"><div class="label">Phone</div><div class="value">${inquiry.phone}</div></div>
          ${inquiry.productName ? `<div class="field"><div class="label">Product</div><div class="value">${inquiry.productName}</div></div>` : ''}
          <div class="field"><div class="label">Message</div><div class="value">${inquiry.message}</div></div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.site.adminEmail,
    subject: `New Inquiry from ${inquiry.name}`,
    html,
  });
};
