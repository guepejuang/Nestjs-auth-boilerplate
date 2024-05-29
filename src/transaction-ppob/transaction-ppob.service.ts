import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import PG_CONNECTION from 'utils/urls';
import * as schema from 'schema/schema';
import { AUTH_PAYLOAD } from 'src/auth/auth.service';
import { eq } from 'drizzle-orm';
@Injectable()
export class TransactionPpobService {
  constructor(
    @Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {} //

  async allTransaction(user: AUTH_PAYLOAD) {
    const transactions = await this.db.query.transaksiPPOB.findMany({
      where: eq(schema.transaksiPPOB.konterId, user.konter_id),
    });

    return transactions;
  }

  async getBeranda(user: AUTH_PAYLOAD) {
    const transactions = await this.db.query.transaksiPPOB.findMany({
      where: eq(schema.transaksiPPOB.konterId, user.konter_id),
      limit: 5,
    });

    return transactions;
  }
  async findOneByRefId(refId: string) {
    // return refId;
    const transaction = await this.db.query.transaksiPPOB.findFirst({
      where: eq(schema.transaksiPPOB.refId, refId),
    });

    if (transaction?.id) {
      return {
        data: transaction,
      };
    }
    throw new NotFoundException('Transaksi tidak ditemukan');
  }
}
