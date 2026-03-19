import prisma from '../config/db';

export interface Activity {
  id?: number;
  gymId?: number;
  name: string;
  description?: string;
  instructor?: string;
  schedule?: string;
  capacity?: number;
}

export class ActivityModel {
  static async getAll(gymId: number) {
    return prisma.activity.findMany({ where: { gymId } });
  }

  static async getById(id: number, gymId: number) {
    return prisma.activity.findUnique({ where: { id, gymId } });
  }

  static async create(data: Activity & { gymId?: number }) {
    const activity = await prisma.activity.create({
      data: {
        gymId: data.gymId || 1,
        name: data.name,
        description: data.description || null,
        instructor: data.instructor || null,
        schedule: data.schedule || null,
        capacity: data.capacity || 20,
      }
    });
    return activity.id;
  }

  static async update(id: number, gymId: number, data: Activity) {
    try {
      await prisma.activity.update({
        where: { id, gymId },
        data: {
          name: data.name,
          description: data.description || null,
          instructor: data.instructor || null,
          schedule: data.schedule || null,
          capacity: data.capacity || 20,
        }
      });
      return 1;
    } catch {
      return 0;
    }
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.activity.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}
