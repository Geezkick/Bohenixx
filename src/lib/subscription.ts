import { db } from '@/lib/db';

export async function checkSubscription(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;

  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: 'active'
    }
  });

  return !!subscription;
}
