import { sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  decimal,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  username: varchar('username').unique().notNull(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  whatsapp: varchar('whatsapp').notNull().unique(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  status: boolean('status').default(true),
});

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users);

export type NewUser = typeof users.$inferInsert;

export const konter = pgTable('konters', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  province: varchar('province').notNull(),
  saldoPPOB: decimal('saldoPPOB').default('0'),
  saldoKonter: decimal('saldoKonter').default('0'),
  status: boolean('status').default(true),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const insertKonterSchema = createInsertSchema(konter);

export const digiflazz = pgTable('digiflazz', {
  id: serial('id').primaryKey(),
  productName: varchar('product_name').notNull(),
  category: varchar('category').notNull(),
  brand: varchar('brand').notNull(),
  type: varchar('type').notNull(),
  desc: varchar('desc').notNull(),
  price: decimal('price').notNull(),
  buyerSkuCode: varchar('buyer_sku_code').notNull(),
  buyerProductStatus: boolean('buyer_product_status').notNull(),
  sellerProductStatus: boolean('seller_product_status').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export type Digiflazz = typeof digiflazz.$inferInsert;
export const insertDigiflazzSchema = createInsertSchema(digiflazz);
export const selectDigiflazzSchema = createSelectSchema(digiflazz);
