import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Banner from '../models/Banner';
import Testimonial from '../models/Testimonial';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devendra-electricals';

const categories = [
  { name: 'Wires & Cables', slug: 'wires-cables', description: 'High-quality electrical wires and cables for home and industrial use', icon: 'zap', order: 1 },
  { name: 'LED Lights', slug: 'led-lights', description: 'Energy-efficient LED lights, bulbs, and fixtures', icon: 'sun', order: 2 },
  { name: 'Switches', slug: 'switches', description: 'Premium switches and switchboards for modern homes', icon: 'toggle-left', order: 3 },
  { name: 'Fans', slug: 'fans', description: 'Ceiling fans, exhaust fans, and industrial fans', icon: 'wind', order: 4 },
  { name: 'MCBs', slug: 'mcbs', description: 'Miniature circuit breakers and electrical protection devices', icon: 'shield', order: 5 },
  { name: 'Inverters', slug: 'inverters', description: 'Home inverters, batteries, and power backup solutions', icon: 'battery-charging', order: 6 },
  { name: 'Electrical Tools', slug: 'electrical-tools', description: 'Professional electrical tools and accessories', icon: 'tool', order: 7 },
  { name: 'Home Appliances', slug: 'home-appliances', description: 'Essential home appliances and electrical accessories', icon: 'home', order: 8 },
];

const products = [
  { name: 'Finolex 1.5 sq mm PVC Insulated Copper Wire', brand: 'Finolex', price: 850, mrp: 950, stock: 100, featured: true },
  { name: 'Havells 6A 2-Way Switch', brand: 'Havells', price: 45, mrp: 55, stock: 500, featured: true },
  { name: 'Philips 12W LED Bulb (Cool Day Light)', brand: 'Philips', price: 120, mrp: 150, stock: 300, featured: true },
  { name: 'Bajaj Crest 1200mm Ceiling Fan', brand: 'Bajaj', price: 2450, mrp: 2995, stock: 50, featured: true },
  { name: 'Anchor 6A Modular Switch (White)', brand: 'Anchor', price: 35, mrp: 45, stock: 1000 },
  { name: 'Havells 20W LED Panel Light', brand: 'Havells', price: 450, mrp: 550, stock: 100, featured: true },
  { name: 'Luminous 850VA Pure Sinewave Inverter', brand: 'Luminous', price: 6500, mrp: 7999, stock: 20, featured: true },
  { name: 'Polycab 4 sq mm 4-Core Copper Cable (per meter)', brand: 'Polycab', price: 120, mrp: 140, stock: 500, featured: true },
  { name: 'Legrand 16A 1-Way Switch (Mylinc)', brand: 'Legrand', price: 65, mrp: 80, stock: 200 },
  { name: 'Havells DHILL 32A Single Pole MCB', brand: 'Havells', price: 95, mrp: 120, stock: 200, featured: true },
  { name: 'Crompton 48" High Speed Ceiling Fan', brand: 'Crompton', price: 3200, mrp: 3990, stock: 30 },
  { name: 'Philips 22W LED Batten (1.2m)', brand: 'Philips', price: 550, mrp: 700, stock: 80 },
  { name: 'Finolex 2.5 sq mm PVC Insulated Copper Wire', brand: 'Finolex', price: 1200, mrp: 1350, stock: 100 },
  { name: 'GM Modular 6A Socket with Switch', brand: 'GM', price: 75, mrp: 95, stock: 300 },
  { name: 'Luminous Inverlast 150Ah Battery', brand: 'Luminous', price: 12500, mrp: 14999, stock: 15 },
  { name: 'Havells 50W LED Flood Light', brand: 'Havells', price: 1250, mrp: 1599, stock: 60 },
  { name: 'Polycab 1 sq mm 2-Core Wire (per meter)', brand: 'Polycab', price: 45, mrp: 55, stock: 1000 },
  { name: 'Bajaj 200mm Exhaust Fan', brand: 'Bajaj', price: 1800, mrp: 2200, stock: 40 },
  { name: 'Legrand 20A DP Switch (Mylinc)', brand: 'Legrand', price: 120, mrp: 150, stock: 150 },
  { name: 'Havells DHILL 63A 2-Pole MCB', brand: 'Havells', price: 250, mrp: 320, stock: 100 },
];

const specsMap: Record<string, { key: string; value: string }[]> = {
  'Finolex 1.5 sq mm PVC Insulated Copper Wire': [
    { key: 'Size', value: '1.5 sq mm' },
    { key: 'Material', value: 'Copper' },
    { key: 'Insulation', value: 'PVC' },
    { key: 'Voltage Grade', value: '1100V' },
    { key: 'Packing', value: '90 meters coil' },
  ],
  'Havells 6A 2-Way Switch': [
    { key: 'Current Rating', value: '6A' },
    { key: 'Type', value: '2-Way' },
    { key: 'Material', value: 'Urea Formaldehyde' },
    { key: 'Color', value: 'White' },
    { key: 'Brand', value: 'Havells' },
  ],
  'Philips 12W LED Bulb (Cool Day Light)': [
    { key: 'Wattage', value: '12W' },
    { key: 'Color Temperature', value: '6500K (Cool Day Light)' },
    { key: 'Lumen Output', value: '1200 lm' },
    { key: 'Base Type', value: 'B22 (Bayonet)' },
    { key: 'Life', value: '25,000 hours' },
  ],
  'Bajaj Crest 1200mm Ceiling Fan': [
    { key: 'Size', value: '1200mm' },
    { key: 'Speed', value: '380 RPM' },
    { key: 'Air Delivery', value: '210 m³/min' },
    { key: 'Power Consumption', value: '70W' },
    { key: 'Warranty', value: '2 Years' },
  ],
};

const bannerData = [
  {
    title: 'Quality Electrical Products',
    subtitle: 'Your Trusted Electrical Shop in Kanpur',
    description: 'Premium wires, switches, fans, lights, and everything electrical for your home and business.',
    buttonText: 'Explore Products',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/electrical-banner-1',
    order: 1,
  },
  {
    title: 'Authorized Dealers of Top Brands',
    subtitle: 'Havells | Philips | Bajaj | Luminous | Finolex | Polycab',
    description: '100% genuine products with manufacturer warranty. Best prices in Kanpur.',
    buttonText: 'Shop Now',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/electrical-banner-2',
    order: 2,
  },
];

const testimonialData = [
  {
    name: 'Rajesh Gupta',
    content: 'Best electrical shop in Kanpur! Genuine products at reasonable prices. Highly recommended for all electrical needs.',
    rating: 5,
    order: 1,
  },
  {
    name: 'Amit Sharma',
    content: 'I purchased all the wiring material for my new home from Devendra Electricals. Great quality and excellent service!',
    rating: 5,
    order: 2,
  },
  {
    name: 'Priya Verma',
    content: 'Very knowledgeable staff. They helped me choose the right inverter for my home. Professional and trustworthy.',
    rating: 5,
    order: 3,
  },
  {
    name: 'Sunil Kumar',
    content: 'The best place for industrial electrical supplies in Kanpur. They stock everything you need. Competitive pricing too!',
    rating: 4,
    order: 4,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Testimonial.deleteMany({});

    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@devendraelectricals.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      phone: '+91-9876543210',
    });
    console.log('Admin user created');

    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    const categoryMap: Record<string, string> = {};
    const categoryNames = ['wires-cables', 'led-lights', 'switches', 'fans', 'mcbs', 'inverters', 'electrical-tools', 'home-appliances'];

    for (const cat of createdCategories) {
      const key = categoryNames.find((n) => cat.slug.includes(n)) || cat.slug;
      categoryMap[key] = cat._id.toString();
    }

    const productDocs = products.map((p) => {
      let categorySlug = 'home-appliances';
      if (p.name.toLowerCase().includes('wire') || p.name.toLowerCase().includes('cable')) categorySlug = 'wires-cables';
      else if (p.name.toLowerCase().includes('led') || p.name.toLowerCase().includes('bulb') || p.name.toLowerCase().includes('light') || p.name.toLowerCase().includes('batten') || p.name.toLowerCase().includes('flood')) categorySlug = 'led-lights';
      else if (p.name.toLowerCase().includes('switch') || p.name.toLowerCase().includes('socket')) categorySlug = 'switches';
      else if (p.name.toLowerCase().includes('fan')) categorySlug = 'fans';
      else if (p.name.toLowerCase().includes('mcb')) categorySlug = 'mcbs';
      else if (p.name.toLowerCase().includes('inverter') || p.name.toLowerCase().includes('battery')) categorySlug = 'inverters';

      const categoryId = categoryMap[categorySlug] || createdCategories[0]._id.toString();
      const specs = specsMap[p.name] || [{ key: 'Brand', value: p.brand || 'Standard' }];
      const tags = p.name.toLowerCase().split(' ').filter((w) => w.length > 2);

      return {
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: `Premium quality ${p.name} available at Devendra Electricals, Kanpur. Authorized dealer with best prices and warranty.`,
        shortDescription: `High-quality ${p.brand} product for reliable electrical performance.`,
        category: categoryId,
        price: p.price,
        mrp: p.mrp,
        images: ['https://placehold.co/600x600/1a1a2e/f59e0b?text=' + encodeURIComponent(p.brand || 'Product')],
        stock: p.stock,
        featured: p.featured || false,
        specifications: specs,
        brand: p.brand,
        tags,
        seoTitle: `${p.name} - Best Price in Kanpur`.slice(0, 70),
        seoDescription: `Buy ${p.name} at best price in Kanpur. Shop genuine ${p.brand} products at Devendra Electricals.`.slice(0, 160),
      };
    });

    const createdProducts = await Product.insertMany(productDocs);
    console.log(`${createdProducts.length} products created`);

    await Banner.insertMany(bannerData);
    console.log('Banners created');

    await Testimonial.insertMany(testimonialData);
    console.log('Testimonials created');

    console.log('\n✓ Seed completed successfully!');
    console.log('Admin login:');
    console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@devendraelectricals.com'}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
