import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { retentionPolicies, mockFiles } from '../../../db/schema';
import { eq, lt, and } from 'drizzle-orm';

export async function GET() {
  try {
    const policies = await db.select().from(retentionPolicies);
    let totalDeleted = 0;


    for (const policy of policies) {

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

      const deletedFiles = await db.delete(mockFiles)
        .where(
          and(
            eq(mockFiles.fileType, policy.fileType),
            lt(mockFiles.uploadedAt, cutoffDate) 
          )
        )
        .returning();
      
      totalDeleted += deletedFiles.length;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron job complete. Deleted ${totalDeleted} expired files.` 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to run cleanup engine" }, { status: 500 });
  }
}