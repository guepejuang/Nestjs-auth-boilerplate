import { Module } from '@nestjs/common';
import { DigiflazzController } from './digiflazz.controller';
import { DigiflazzService } from './digiflazz.service';
import { DrizzleModule } from 'src/core/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [DigiflazzController],
  providers: [DigiflazzService],
})
export class DigiflazzModule {}
