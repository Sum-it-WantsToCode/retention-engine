'use server'

import { headers } from 'next/headers';
import { db } from '../db';
import { retentionPolicies, mockFiles, auditLogs } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function createPolicy(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const fileType = formData.get('fileType') as string;
  const retentionDays = parseInt(formData.get('retentionDays') as string);
  
  await db.insert(retentionPolicies).values({ 
    userId,
    fileType, 
    retentionDays 
  });
  revalidatePath('/');
}

export async function deletePolicy(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const id = parseInt(formData.get('id') as string);
  
  await db.delete(retentionPolicies).where(
    and(
      eq(retentionPolicies.id, id),
      eq(retentionPolicies.userId, userId)
    )
  );
  revalidatePath('/');
}

export async function generateMockFile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const fileType = formData.get('fileType') as string;
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 40);

  const randomSize = Math.floor(Math.random() * 20) + 1;

  await db.insert(mockFiles).values({
    userId,
    fileName: `old_${fileType.toLowerCase()}_${Math.floor(Math.random() * 1000)}.png`,
    fileType,
    fileSize: randomSize,
    uploadedAt: pastDate,
  });

  revalidatePath('/');
}

export async function manualRunEngine() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Dynamically read the exact domain the user is currently on
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  
  const baseUrl = `${protocol}://${host}`;

  await fetch(`${baseUrl}/api/cron`, { method: 'GET' });
  revalidatePath('/');
}

export async function clearLogs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(auditLogs).where(eq(auditLogs.userId, userId));
  revalidatePath('/');
}

export async function togglePolicy(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const id = parseInt(formData.get('id') as string);
  const currentStatus = formData.get('isActive') === 'true'; 
  
  await db.update(retentionPolicies)
    .set({ isActive: !currentStatus })
    .where(
      and(
        eq(retentionPolicies.id, id),
        eq(retentionPolicies.userId, userId)
      )
    );

  revalidatePath('/');
}

export async function resetWorkspace() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(mockFiles).where(eq(mockFiles.userId, userId));
  await db.delete(auditLogs).where(eq(auditLogs.userId, userId));
  
  await db.insert(auditLogs).values({
    userId,
    message: `⚠️ Workspace environment was manually reset by admin.`
  });

  revalidatePath('/');
}