import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { auditLogs } from '../../../db/schema';

export async function GET() {
  try {
    const logs = await db.select().from(auditLogs);
    
    // Create CSV Headers
    let csvData = 'ID,Timestamp,Message\n';
    
    // Loop through logs and add rows
    logs.forEach(log => {
      // We wrap the message in quotes in case it contains commas, which would break the spreadsheet
      csvData += `${log.id},${log.createdAt.toISOString()},"${log.message}"\n`;
    });

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="retention_audit_logs.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}