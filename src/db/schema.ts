import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const retentionPolicies = pgTable("retention_policies", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  fileType: text("file_type").notNull(),
  retentionDays: integer("retention_days").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mockFiles = pgTable('mock_files', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').default(5).notNull(), 
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(), 
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});