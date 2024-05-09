import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { selectDigiflazzSchema } from 'schema/schema';

export const PriceListDigiflazzSchema = z.object({
  product_name: z.string(),
  category: z.string(),
  brand: z.string(),
  type: z.string(),
  seller_name: z.string(),
  price: z.number(),
  buyer_sku_code: z.string(),
  buyer_product_status: z.boolean(),
  seller_product_status: z.boolean(),
  unlimited_stock: z.boolean(),
  stock: z.number(),
  multi: z.boolean(),
  start_cut_off: z.string(),
  end_cut_off: z.string(),
  desc: z.string(),
});

export type PriceListDigiflazz = z.infer<typeof PriceListDigiflazzSchema>;

export class DigiflazzWhereDTO extends createZodDto(
  selectDigiflazzSchema.partial(),
) {}
