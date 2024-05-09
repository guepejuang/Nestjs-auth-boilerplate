import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import PG_CONNECTION from 'utils/urls';
import * as schema from 'schema/schema';
import axios from 'axios';
import * as crypto from 'crypto';
import { DigiflazzWhereDTO, PriceListDigiflazz } from './digiflazz.zod';
import { Digiflazz } from 'schema/schema';
import { and, eq, or, param } from 'drizzle-orm';
@Injectable()
export class DigiflazzService {
  constructor(
    @Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {} //

  async prabayar() {
    // const md5 = argon2.

    const md5 = crypto
      .createHash('md5')
      .update(`zitewao6dk0Wdev-522ec7e0-1a14-11ed-9aaa-e77bb9592db9pricelist`)
      .digest('hex');
    const response = await axios.post(
      'https://api.digiflazz.com/v1/price-list',
      {
        cmd: 'prepaid',
        username: 'zitewao6dk0W',
        sign: md5,
        // code: 'TLK5',
      },
    );

    const digiflazzData: PriceListDigiflazz[] | undefined = ({} =
      response?.data?.data || undefined);

    if (digiflazzData) {
      const digiflazzInsert: Digiflazz[] = digiflazzData.map((data) => {
        return {
          productName: data.product_name,
          category: data.category.toLowerCase(),
          brand: data.brand.toLocaleLowerCase(),
          type: data.type.toLocaleLowerCase(),
          desc: data.desc,
          price: data.price + '',
          buyerSkuCode: data.buyer_sku_code,
          buyerProductStatus: data.buyer_product_status,
          sellerProductStatus: data.seller_product_status,
        };
      });
      await this.db.transaction(async (tx) => {
        await tx.insert(schema.digiflazz).values(digiflazzInsert);
      });

      return {
        statusDescription: 'Data berhasil tersinkronisasi',
      };
    }
    return {
      status: 400,
      statusDescription: 'Data gagal tersinkronisasi',
    };
  }

  async findBy(params: DigiflazzWhereDTO) {
    console.log('Loggg==>', params.brand);
    const data = await this.db
      .select()
      .from(schema.digiflazz)
      .where(
        and(
          params.id ? eq(schema.digiflazz.id, params.id) : undefined,
          params.productName
            ? eq(schema.digiflazz.productName, params.productName)
            : undefined,
          params.category
            ? eq(schema.digiflazz.category, params.category)
            : undefined,
          params.brand ? eq(schema.digiflazz.brand, params.brand) : undefined,
          params.type ? eq(schema.digiflazz.type, params.type) : undefined,
          params.desc ? eq(schema.digiflazz.desc, params.desc) : undefined,
          params.price ? eq(schema.digiflazz.price, params.price) : undefined,
          params.buyerSkuCode
            ? eq(schema.digiflazz.buyerSkuCode, params.buyerSkuCode)
            : undefined,
          params.buyerProductStatus
            ? eq(schema.digiflazz.buyerProductStatus, params.buyerProductStatus)
            : undefined,
          params.sellerProductStatus
            ? eq(
                schema.digiflazz.sellerProductStatus,
                params.sellerProductStatus,
              )
            : undefined,
        ),
      )
      .orderBy(schema.digiflazz.price);

    return data;
  }
}
