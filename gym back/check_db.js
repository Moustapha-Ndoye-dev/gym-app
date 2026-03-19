const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const gyms = await prisma.gym.findMany();
    console.log('Gyms found:', gyms.length);
    if (gyms.length > 0) {
      console.log('First gym:', JSON.stringify(gyms[0], null, 2));
    }
    
    // Check if we can describe the table or just try a raw query
    // But since it's SQLite, we can use PRAGMA
    const tableInfo = await prisma.$queryRawUnsafe('PRAGMA table_info(users)');
    console.log('Users table info:', JSON.stringify(tableInfo, null, 2));
  } catch (err) {
    console.error('Db check error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
