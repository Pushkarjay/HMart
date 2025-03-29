const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function migratePasswords() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (!user.password.startsWith("$2b$")) { // Check if already hashed
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      console.log(`Updated password for ${user.email}`);
    }
  }
  await prisma.$disconnect();
  console.log("Migration complete");
}

migratePasswords().catch(console.error);