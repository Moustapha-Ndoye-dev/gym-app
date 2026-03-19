import prisma from '../config/db';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        gymId: true,
      },
    });
  }

  static async createUser(
    username: string,
    password: string,
    role: string,
    gymId: number,
    email?: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      username,
      email,
      password: hashedPassword,
      role,
      gymId,
    };
    console.log('[USER-MODEL-TRACE] Calling prisma.user.create with:', JSON.stringify(userData, (key, value) => key === 'password' ? '***' : value, 2));

    try {
      const user = await prisma.user.create({
        data: userData,
      });
      console.log(`[USER-MODEL-TRACE] User created successfully:`, JSON.stringify(user, null, 2));
      return user;
    } catch (error: any) {
      console.error(`[USER-MODEL-TRACE] !!! prisma.user.create FAILED !!! Details:`, error);
      throw error;
    }
  }
static async getAll(gymId: number) {
  return prisma.user.findMany({
    where: { gymId },
    select: {
      id: true,
      username: true,
      role: true,
      email: true,
      createdAt: true,
      gymId: true,
    },
  });
}


  static async update(
    id: number,
    username: string,
    role: string,
    password?: string
  ) {
    const dataToUpdate: any = { username, role };
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    try {
      await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      return 1; // 1 change
    } catch {
      return 0; // 0 changes (not found)
    }
  }

  static async delete(id: number) {
    try {
      await prisma.user.delete({ where: { id } });
      return 1;
    } catch {
      return 0;
    }
  }
}
