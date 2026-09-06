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

  // 1. Log to the developer terminal
  console.log("⚡ [Engine] Manual execution triggered...");

  // 2. NEW: Write a log directly to your application's UI database!
  await db.insert(auditLogs).values({
    userId,
    message: "⚡ Manual engine execution triggered by user."
  });

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const cookieHeader = headersList.get('cookie') || '';

  const res = await fetch(`${baseUrl}/api/cron`, { 
    method: 'GET',
    headers: {
      'Cookie': cookieHeader
    }
  });

// 3. Determine the log message based on the result
  let logMessage = "";

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ [Engine] Execution failed:", errorText);
    logMessage = `❌ Engine execution failed: ${errorText}`;
  } else {
    // Read the exact response sent back by your /api/cron route
    let apiResponse = await res.text();
    
    // Safely attempt to parse it if your API route returns JSON (e.g., { message: "Deleted 5 files" })
    try {
      const parsedData = JSON.parse(apiResponse);
      if (parsedData.message) {
        apiResponse = parsedData.message;
      }
    } catch (e) {}
    console.log(`✅ [Engine] ${apiResponse}`);
    logMessage = `✅ ${apiResponse}`;
  }

  await db.insert(auditLogs).values({ // Does an insert into the auditLogs
    userId,
    message: logMessage
  });

  revalidatePath('/');  // Instantly refreshes the UI
}

export async function clearAllData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Deletes all mock files associated with this specific user
  await db.delete(mockFiles).where(eq(mockFiles.userId, userId));
  
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