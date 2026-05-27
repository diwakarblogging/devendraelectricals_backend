import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/devendra-electricals',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  site: {
    name: process.env.SITE_NAME || 'Devendra Electricals',
    url: process.env.SITE_URL || 'http://localhost:3000',
    description: process.env.SITE_DESCRIPTION || 'Your trusted electrical shop in Kanpur',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@devendraelectricals.com',
  },
};

export default config;
