import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

const imports = [HttpModule];
const exportsArr = [HttpModule, AxiosAdapter];
@Module({
  imports: [...imports],
  exports: [...exportsArr],
  providers: [AxiosAdapter]
})
export class SharedModule {}
