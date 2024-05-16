import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import PG_CONNECTION from 'utils/urls';
import * as schema from 'schema/schema';
import axios from 'axios';
import * as crypto from 'crypto';
import {
  DigiFlazzCreatePrabayar,
  DigiflazzWhereDTO,
  PrabayarResponseDigiflazz,
  PriceListDigiflazz,
} from './digiflazz.zod';
import { Digiflazz } from 'schema/schema';
import { and, eq, or, param } from 'drizzle-orm';
import { DigiflazzUrl } from './digiflazz.constant';
@Injectable()
export class DigiflazzService {
  constructor(
    @Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {} //

  generateMd5(key: string) {
    return crypto
      .createHash('md5')
      .update(`zitewao6dk0Wdev-522ec7e0-1a14-11ed-9aaa-e77bb9592db9${key}`)
      .digest('hex');
  }

  async requestDigiflazz(body: any, url: string) {
    try {
      const response = await axios.post(url, body);

      if (response.data?.data) {
        const dataFromDigiflazz = response.data.data;
        return dataFromDigiflazz;
      }

      throw new BadRequestException('Terjadi Kesalahan sistem(D)');
    } catch (error) {
      console.error('error===>', error.response);
      throw new BadRequestException('Terjadi Kesalahan sistem(D)');
    }
  }
  async prabayar() {
    // const md5 = argon2.

    const md5 = this.generateMd5('pricelist');
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

  async findBySkuCode(sku: string) {
    const data = await this.db.query.digiflazz.findFirst({
      where: eq(schema.digiflazz.buyerSkuCode, sku),
    });
    return data;
  }

  async bayarPrabayar(body: DigiFlazzCreatePrabayar) {
    // 1. Cek apakah ada di DB atau tidak
    let ppobData: Digiflazz | undefined = undefined;
    if (
      process.env.NODE_ENV !== 'production' &&
      body.buyerSkuCode === 'xld10'
    ) {
      ppobData = {
        id: 0,
        productName: 'Xl 10.000',
        category: 'Pulsa',
        brand: 'XL',
        type: 'Umum',
        price: '9800',
        buyerSkuCode: 'xld10',
        buyerProductStatus: true,
        sellerProductStatus: true,
        desc: 'Pulsa Xl Rp 100.000',
      };
    } else {
      ppobData = await this.findBySkuCode(body.buyerSkuCode);
      if (!ppobData?.id) {
        throw new NotFoundException('Data Item Tidak ditemukan');
      }
    }

    // 2. Insert ke tabel transaksi sebagai pending
    const refId = await this.generateOrderId();
    // const pendingTransaction = await this.db.insert(schema.transaksiPPOB).values({

    // })
    // 3. Hit transaksi ke api digiflazz
    // 4. Update status transaksi sebagai sukses atau gagal

    const md5 = this.generateMd5(refId);
    // const dataPpob = await this.findBySkuCode(body.buyerSkuCode)
    // const marginKeuntungan = dataPpob
    const requestDigiflazz = {
      username: 'zitewao6dk0W',
      buyer_sku_code: body.buyerSkuCode,
      customer_no: body.customerNo,
      ref_id: refId,
      sign: md5,
      testing: true,
    };

    console.log('REQUEST', { requestDigiflazz });
    const digiflazData = await this.requestDigiflazz(
      requestDigiflazz,
      DigiflazzUrl.TRANSACTION,
    );

    // const newTransaction = await this.db.insert(schema.transaksiPPOB).values({
    //         refId: digiflazData.refId,
    //   customerNo: digiflazData.CustomerNo,
    //   price: digiflazData.Price,
    //   hargaJual: body.hargaJual,
    //   hargaKeuntungan: body.hargaKeuntungan,
    //   kuntungan: body.
    //   buyerSkuCode
    //   status
    //   rc
    //   tele
    //   wa
    // });
    return digiflazData;
  }

  async generateOrderId(): Promise<string> {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0'); // Suffix acak antara 0000 dan 9999
    const orderId = `${timestamp}${randomSuffix}`;

    // Pastikan order_id yang dihasilkan belum digunakan sebelumnya
    const existingOrder = await this.db.query.transaksiPPOB.findFirst({
      where: eq(schema.transaksiPPOB.refId, orderId),
    });

    if (existingOrder) {
      // Jika order_id sudah ada, panggil fungsi generateOrderId() lagi
      return this.generateOrderId();
    }

    return orderId;
  }
}
