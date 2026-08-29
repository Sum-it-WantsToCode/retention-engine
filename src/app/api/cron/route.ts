import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { retentionPolicies, mockFiles, auditLogs } from '../../../db/schema';
import { eq, lt, and } from 'drizzle-orm';

export async function GET() {
  try {
    const policies = await db.select().from(retentionPolicies).where(eq(retentionPolicies.isActive, true)); 
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

      if (deletedFiles.length > 0) {
        await db.insert(auditLogs).values({
          message: `Engine automatically deleted ${deletedFiles.length} expired ${policy.fileType} file(s).`
        });
      }
    }

    return NextResponse.json({ success: true, message: `Deleted ${totalDeleted} files.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to run engine" }, { status: 500 });
  }
}