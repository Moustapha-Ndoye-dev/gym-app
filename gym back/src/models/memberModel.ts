import prisma from '../config/db';
import { Member } from '@prisma/client';
import { MemberWithSubscription } from '../types';

export class MemberModel {
  static async getAll(gymId: number): Promise<MemberWithSubscription[]> {
    return prisma.member.findMany({
      where: { gymId },
      orderBy: { registrationDate: 'desc' },
      include: { subscription: true },
    });
  }

  static async getById(
    id: number,
    gymId: number
  ): Promise<MemberWithSubscription | null> {
    return prisma.member.findUnique({
      where: { id, gymId },
      include: { subscription: true },
    });
  }

  static async create(data: Partial<Member> & { gymId: number, durationMonths?: number }) {
    console.log('[MEMBER-MODEL-TRACE] Entering create method with data:', JSON.stringify(data, null, 2));
    try {
      return await prisma.$transaction(async (tx) => {
        console.log('[MEMBER-MODEL-TRACE] Starting transaction.');
        let expiryDate = null;
        let amount = 0;

        // Determine duration: custom choice or default from subscription
        let finalDuration = data.durationMonths || 0;

        if (data.subscriptionId) {
          console.log('[MEMBER-MODEL-TRACE] Subscription ID found:', data.subscriptionId);
          const subscription = await tx.subscription.findUnique({
            where: { id: data.subscriptionId },
          });
          
          if (subscription) {
            // If no custom duration provided, use the subscription's default
            if (!finalDuration) {
              finalDuration = subscription.durationMonths;
            }
            
            const date = new Date();
            date.setMonth(date.getMonth() + finalDuration);
            expiryDate = date;
            
            // Adjust price based on duration (simple proportional calculation if custom)
            // Or just use subscription price if it's the default duration
            amount = finalDuration === subscription.durationMonths 
              ? subscription.price 
              : (subscription.price / subscription.durationMonths) * finalDuration;

            console.log('[MEMBER-MODEL-TRACE] Subscription details processed:', { expiryDate, amount, finalDuration });
          }
        }

        const memberData = {
          gymId: data.gymId,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          photo: data.photo,
          subscriptionId: data.subscriptionId,
          expiryDate: expiryDate,
          registrationDate: new Date(), // Force current date to avoid invalid date issues
        };

        console.log('[MEMBER-MODEL-TRACE] Calling tx.member.create with:', JSON.stringify(memberData, null, 2));
        const member = await tx.member.create({ data: memberData });
        console.log('[MEMBER-MODEL-TRACE] tx.member.create returned:', JSON.stringify(member, null, 2));


        if (amount > 0) {
          console.log('[MEMBER-MODEL-TRACE] Creating transaction for amount:', amount);
          await tx.transaction.create({
            data: {
              gymId: data.gymId,
              amount: amount,
              type: 'income',
              description: `Adhesion membre: ${data.firstName} ${data.lastName} (${finalDuration} mois)`,
              date: new Date(),
            },
          });
          console.log('[MEMBER-MODEL-TRACE] Transaction created.');
        }

        console.log('[MEMBER-MODEL-TRACE] Transaction finished, returning member.id:', member.id);
        return member.id;
      });
    } catch (error) {
      console.error('[MEMBER-MODEL-TRACE] !!! TRANSACTION FAILED !!! Details:', error);
      throw error;
    }
  }

  static async update(id: number, gymId: number, data: Partial<Member>) {
    try {
      await prisma.member.update({
        where: { id, gymId },
        data,
      });
      return 1;
    } catch {
      return 0;
    }
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.member.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}

