'use server'

import { db } from '../db';
import { retentionPolicies, mockFiles } from '../db/schema';
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

  await db.insert(mockFiles).values({
    userId: "test_user_1",
    fileName: `old_${fileType.toLowerCase()}_${Math.floor(Math.random() * 1000)}.png`,
    fileType,
    uploadedAt: pastDate,
  });

  revalidatePath('/');
}

export async function manualRunEngine() {
  await fetch('http://localhost:3000/api/cron', { method: 'GET' });
  revalidatePath('/');
}