const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        gymId: true
      }
    });
    console.log('Users in DB:');
    users.forEach(u => console.log(`- ${u.username} (${u.role}) [Gym: ${u.gymId}]`));
    
    const gyms = await prisma.gym.findMany();
    console.log('\nGyms in DB:');
    gyms.forEach(g => console.log(`- ${g.name} (ID: ${g.id})`));

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
