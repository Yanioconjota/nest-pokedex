import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { SharedModule } from 'src/shared/shared.module';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [SharedModule, PokemonModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
