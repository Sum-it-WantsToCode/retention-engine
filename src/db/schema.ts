import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const retentionPolicies = pgTable("retention_policies", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  fileType: text("file_type").notNull(),
  retentionDays: integer("retention_days").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});