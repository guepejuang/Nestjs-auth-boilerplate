import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { DigiflazzService } from './digiflazz.service';
import { Public } from 'src/core/decorators/public.decorator';
import { DigiFlazzCreatePrabayar, DigiflazzWhereDTO } from './digiflazz.zod';
import { Request } from 'express';
import { UserInterceptor } from 'src/core/Interceptors/user.interceptor';

// @Public()
@Controller('digiflazz')
export class DigiflazzController {
  constructor(private readonly digiflazzService: DigiflazzService) {}
  @Post('/async')
  asynDigiflazz() {
    return this.digiflazzService.prabayar();
  }

  @Public()
  @Post('/test')
  testPPOB() {
    return this.digiflazzService.testPPOB();
  }

  @Get()
  findDigiflazz(@Query() params: DigiflazzWhereDTO) {
    return this.digiflazzService.findBy(params);
  }

  @Post('/prabayar')
  // @UseInterceptors(UserInterceptor)
  bayarPrabayar(
    @Body() body: DigiFlazzCreatePrabayar,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.digiflazzService.bayarPrabayar(body, user);
  }
}
