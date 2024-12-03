import { Module } from '@nestjs/common';

@Module({
  exports: [SharedModule],
})
export class SharedModule {}
