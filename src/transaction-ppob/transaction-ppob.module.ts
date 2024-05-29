import { Module } from '@nestjs/common';
import { TransactionPpobService } from './transaction-ppob.service';
import { TransactionPpobController } from './transaction-ppob.controller';
import { DrizzleModule } from 'src/core/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [TransactionPpobService],
  controllers: [TransactionPpobController],
})
export class TransactionPpobModule {}
