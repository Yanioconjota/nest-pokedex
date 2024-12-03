import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

const imports = [HttpModule]
@Module({
  imports: [...imports],
  exports: [HttpModule],
})
export class SharedModule {}
