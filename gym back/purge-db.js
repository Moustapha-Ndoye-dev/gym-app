const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function purge() {
  console.log('--- Purging Database ---');
  try {
    // Delete in order to avoid foreign key constraint issues
    // Or just delete all in a transaction if possible, but SQLite might be simple
    
    console.log('Cleaning Access Logs...');
    await prisma.accessLog.deleteMany({});
    
    console.log('Cleaning Transactions...');
    await prisma.transaction.deleteMany({});
    
    console.log('Cleaning Tickets...');
    await prisma.ticket.deleteMany({});
    
    console.log('Cleaning Members...');
    await prisma.member.deleteMany({});
    
    console.log('Cleaning Products...');
    await prisma.product.deleteMany({});
    
    console.log('Cleaning Activities...');
    await prisma.activity.deleteMany({});
    
    console.log('Cleaning Subscriptions...');
    await prisma.subscription.deleteMany({});
    
    console.log('Cleaning Users...');
    await prisma.user.deleteMany({});
    
    console.log('Cleaning Gyms...');
    await prisma.gym.deleteMany({});

    console.log('--- Database Purged Successfully ---');
  } catch (error) {
    console.error('Error during purge:', error);
  } finally {
    await prisma.$disconnect();
  }
}

purge();
