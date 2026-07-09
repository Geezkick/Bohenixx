import { db } from '@/lib/db';

export async function checkSubscription(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;

  const subscription = await db.userSubscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE'
    }
  });

  return !!subscription;
}
