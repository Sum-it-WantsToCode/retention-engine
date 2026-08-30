'use server'

import { db } from '../db';
import { retentionPolicies, mockFiles, auditLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPolicy(formData: FormData) {
  const fileType = formData.get('fileType') as string;
  const retentionDays = parseInt(formData.get('retentionDays') as string);
  await db.insert(retentionPolicies).values({ userId: "test_user_1", fileType, retentionDays });
  revalidatePath('/');
}

export async function deletePolicy(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await db.delete(retentionPolicies).where(eq(retentionPolicies.id, id));
  revalidatePath('/');
}

export async function generateMockFile(formData: FormData) {
  const fileType = formData.get('fileType') as string;
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 40);

  const randomSize = Math.floor(Math.random() * 20) + 1;

  await db.insert(mockFiles).values({
    userId: "Sumit",
    fileName: `old_${fileType.toLowerCase()}_${Math.floor(Math.random() * 1000)}.png`,
    fileType,
    fileSize: randomSize,
    uploadedAt: pastDate,
  });

  revalidatePath('/');
}

export async function manualRunEngine() {
  await fetch('http://localhost:3000/api/cron', { method: 'GET' });
  revalidatePath('/');
}

export async function clearLogs() {
  await db.delete(auditLogs);
  revalidatePath('/');
}

export async function togglePolicy(formData: FormData) {
  const id = parseInt(formData.get('id') as string);

  const currentStatus = formData.get('isActive') === 'true'; 
  await db.update(retentionPolicies)
    .set({ isActive: !currentStatus })
    .where(eq(retentionPolicies.id, id));

  revalidatePath('/');
}

export async function resetWorkspace() {
  // Wipes all mock files and audit logs from the database
  await db.delete(mockFiles);
  await db.delete(auditLogs);
  
  // Log the action itself so the user knows what happened
  await db.insert(auditLogs).values({
    message: `⚠️ Workspace environment was manually reset by admin.`
  });

  revalidatePath('/');
}