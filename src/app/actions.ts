'use server'

import { db } from '../db';
import { retentionPolicies } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPolicy(formData: FormData) {
  const fileType = formData.get('fileType') as string;
  const retentionDays = parseInt(formData.get('retentionDays') as string);

  await db.insert(retentionPolicies).values({
    userId: "test_user_1", 
    fileType,
    retentionDays,
  });

  revalidatePath('/');
}

export async function deletePolicy(formData: FormData) {
  const id = parseInt(formData.get('id') as string);

  await db.delete(retentionPolicies).where(eq(retentionPolicies.id, id));

  revalidatePath('/');
}