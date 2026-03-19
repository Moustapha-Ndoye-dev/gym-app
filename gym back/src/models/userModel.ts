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
      select: { id: true, username: true, role: true, createdAt: true, gymId: true }
    });
  }

  static async createUser(username: string, password: string, role: string, gymId: number, email?: string) {
    console.log(`[USER-MODEL] Attempting to create user: username="${username}", email="${email}", role="${role}", gymId=${gymId}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
          gymId
        }
      });
      console.log(`[USER-MODEL] User created successfully. ID: ${user.id}`);
      return user;
    } catch (error: any) {
      console.error(`[USER-MODEL] Error in prisma.user.create:`, error);
      throw error; 
    }
  }
  
  static async getAll() {
    return prisma.user.findMany({
       select: { id: true, username: true, role: true, createdAt: true, gymId: true }
    });
  }

  static async update(id: number, username: string, role: string, password?: string) {
    const dataToUpdate: any = { username, role };
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    
    try {
      await prisma.user.update({
        where: { id },
        data: dataToUpdate
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
