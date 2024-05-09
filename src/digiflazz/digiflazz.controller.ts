import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DigiflazzService } from './digiflazz.service';
import { Public } from 'src/core/decorators/public.decorator';
import { DigiflazzWhereDTO } from './digiflazz.zod';

@Public()
@Controller('digiflazz')
export class DigiflazzController {
  constructor(private readonly digiflazzService: DigiflazzService) {}
  @Post('/async')
  asynDigiflazz() {
    return this.digiflazzService.prabayar();
  }

  @Get()
  findDigiflazz(@Query() params: DigiflazzWhereDTO) {
    console.log('<====', params);
    return this.digiflazzService.findBy(params);
  }
}
