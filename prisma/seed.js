const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing data (optional)
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // 2. Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@hmart.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        hostel: 'Admin Hostel',
        room: '001'
      },
      {
        email: 'student1@hmart.com',
        password: hashedPassword,
        name: 'John Doe',
        hostel: 'A',
        room: '101'
      },
      {
        email: 'student2@hmart.com',
        password: hashedPassword,
        name: 'Jane Smith',
        hostel: 'B',
        room: '205'
      }
    ],
    skipDuplicates: true
  });

  // 3. Seed Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Books' },
      { name: 'Electronics' },
      { name: 'Furniture' },
      { name: 'Clothing' },
      { name: 'Stationery' }
    ],
    skipDuplicates: true
  });

  // 4. Seed Products
  const seller = await prisma.user.findUnique({
    where: { email: 'student1@hmart.com' }
  });

  const products = await prisma.product.createMany({
    data: [
      {
        title: 'Calculus Textbook',
        description: 'Like new condition, 5th edition',
        price: 29.99,
        status: 'ACTIVE',
        sellerId: seller.id,
        images: {
          main: 'calc_textbook.jpg',
          others: ['calc_1.jpg', 'calc_2.jpg']
        }
      },
      {
        title: 'Used Laptop',
        description: 'Dell XPS 13, 2 years old but works perfectly',
        price: 450.00,
        status: 'ACTIVE',
        sellerId: seller.id,
        images: {
          main: 'laptop_main.jpg',
          others: ['laptop_angle.jpg']
        }
      }
    ]
  });

  // 5. Connect Products to Categories
  const bookCategory = await prisma.category.findUnique({
    where: { name: 'Books' }
  });
  
  const electronicsCategory = await prisma.category.findUnique({
    where: { name: 'Electronics' }
  });

  const calculusBook = await prisma.product.findFirst({
    where: { title: 'Calculus Textbook' }
  });

  const usedLaptop = await prisma.product.findFirst({
    where: { title: 'Used Laptop' }
  });

  await prisma.product.update({
    where: { id: calculusBook.id },
    data: {
      categories: {
        connect: { id: bookCategory.id }
      }
    }
  });

  await prisma.product.update({
    where: { id: usedLaptop.id },
    data: {
      categories: {
        connect: { id: electronicsCategory.id }
      }
    }
  });

  console.log('Seeding completed successfully!');
  console.log(`Created: ${users.count} users, ${categories.count} categories, ${products.count} products`);
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });