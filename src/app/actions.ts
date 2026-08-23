'use server'

import { db } from '../db';
import { retentionPolicies } from '../db/schema';
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