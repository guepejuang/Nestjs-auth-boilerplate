import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DigiflazzService } from './digiflazz.service';
import { Public } from 'src/core/decorators/public.decorator';
import { DigiFlazzCreatePrabayar, DigiflazzWhereDTO } from './digiflazz.zod';

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
    return this.digiflazzService.findBy(params);
  }

  @Post('/prabayar')
  bayarPrabayar(@Body() body: DigiFlazzCreatePrabayar) {
    return this.digiflazzService.bayarPrabayar(body);
  }
}
