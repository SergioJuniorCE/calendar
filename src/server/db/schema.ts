import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  date,
  integer,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `calendar_${name}`);

export const notes = createTable(
  "note",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    titleIndex: index("title_idx").on(table.title),
  })
);

export const tasks = createTable(
  "task",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 50 }).notNull().default("todo"),
    dueDate: date("due_date"),
    dueTime: varchar("due_time", { length: 8 }), // Changed from time to varchar
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    titleIndex: index("task_title_idx").on(table.title),
    statusIndex: index("task_status_idx").on(table.status),
    dueDateIndex: index("task_due_date_idx").on(table.dueDate),
  })
);

export const kanbanColumns = createTable(
  "kanban_column",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    nameIndex: index("kanban_column_name_idx").on(table.name),
    orderIndex: index("kanban_column_order_idx").on(table.order),
  })
);
