import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const mockFiles = pgTable('mock_files', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().default('test_user_1'),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow()
});

export const retentionPolicies = pgTable('retention_policies', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().default('test_user_1'),
  fileType: text('file_type').notNull(),
  retentionDays: integer('retention_days').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().default('test_user_1'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});