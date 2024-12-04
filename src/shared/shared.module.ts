import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

const imports = [HttpModule]
@Module({
  imports: [...imports],
  exports: [HttpModule, AxiosAdapter],
  providers: [AxiosAdapter]
})
export class SharedModule {}
