import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { TransactionPpobService } from './transaction-ppob.service';

@Controller('transaction-ppob')
export class TransactionPpobController {
  constructor(
    private readonly transactionPpobService: TransactionPpobService,
  ) {}

  @Get()
  async getAllTransaction(@Req() request: Request) {
    const user = request.user;

    return await this.transactionPpobService.allTransaction(user);
  }

  @Get('/beranda')
  async beranda(@Req() request: Request) {
    // return refId;
    const user = request.user;

    return await this.transactionPpobService.getBeranda(user);
  }
  @Get(':refId')
  async findByRefId(@Param() params: { refId: string }) {
    // return refId;
    return await this.transactionPpobService.findOneByRefId(params.refId);
  }
}
