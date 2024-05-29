import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  decimal,
  integer,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

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

export const usersRelation = relations(users, ({ many }) => ({
  konters: many(konter),
  transaksiPPOB: many(transaksiPPOB),
}));

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
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'restrict',
  }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const konterRelation = relations(konter, ({ one, many }) => ({
  user: one(users, {
    fields: [konter.userId],
    references: [users.id],
  }),
  transaksiPPOB: many(transaksiPPOB),
}));

export const insertKonterSchema = createInsertSchema(konter);

export const digiflazz = pgTable('digiflazz', {
  id: serial('id').primaryKey(),
  productName: varchar('product_name').notNull(),
  category: varchar('category').notNull(),
  brand: varchar('brand').notNull(),
  type: varchar('type').notNull(),
  desc: varchar('desc').notNull(),
  price: decimal('price').notNull(),
  priceSell: decimal('price_sell').default('0'),
  buyerSkuCode: varchar('buyer_sku_code').notNull(),
  buyerProductStatus: boolean('buyer_product_status').notNull(),
  sellerProductStatus: boolean('seller_product_status').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const digiflazzRelation = relations(digiflazz, ({ many }) => ({
  transaksi: many(transaksiPPOB),
}));

export type Digiflazz = typeof digiflazz.$inferInsert;
export const insertDigiflazzSchema = createInsertSchema(digiflazz);
export const selectDigiflazzSchema = createSelectSchema(digiflazz);
export type SelectDigiflazz = z.infer<typeof selectDigiflazzSchema>;

export const transaksiPPOB = pgTable('transaksi_ppob', {
  id: serial('id').primaryKey(),
  refId: varchar('refId').notNull(),
  customerNo: varchar('customer_no').notNull(),
  price: decimal('price').notNull(),
  hargaJual: decimal('harga_jual').notNull(),
  hargaKeuntungan: decimal('harga_keuntungan').notNull(),
  kuntungan: decimal('kuntungan').notNull(),
  buyerSkuCode: varchar('buyer_sku_code').notNull(),
  status: varchar('status', { enum: ['Sukses', 'Pending', 'Gagal'] }).notNull(),
  rc: varchar('rc'),
  tele: varchar('tele'),
  wa: varchar('wa'),
  digiflazzId: integer('digiflazz_id')
    .notNull()
    .references(() => digiflazz.id, { onDelete: 'restrict' }),
  konterId: integer('konter_id')
    .notNull()
    .references(() => konter.id, { onDelete: 'restrict' }),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const transaksiPPOBRelation = relations(transaksiPPOB, ({ one }) => ({
  digiflaz: one(digiflazz, {
    fields: [transaksiPPOB.price],
    references: [digiflazz.id],
  }),
  konter: one(konter, {
    fields: [transaksiPPOB.konterId],
    references: [konter.id],
  }),
  user: one(users, {
    fields: [transaksiPPOB.createdBy],
    references: [users.id],
  }),
}));

export type TransaksiPPOB = typeof transaksiPPOB.$inferSelect;
export const insertTransaksiPPOBSchema = createInsertSchema(transaksiPPOB);
export const selectTransaksiPPOBSchema = createSelectSchema(transaksiPPOB);
