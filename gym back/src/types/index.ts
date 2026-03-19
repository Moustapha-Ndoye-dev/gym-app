import { Member, Subscription } from '@prisma/client';

export type MemberWithSubscription = Member & {
  subscription: Subscription | null;
};
