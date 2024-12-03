import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  constructor(private readonly httpService: HttpService,
              private readonly pokemonService: PokemonService
  ){}
  async executeSeed() {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20'),
      );
  
      const createPromises = data.results.map(async ({ name, url }) => {
        const segments = url.split('/'); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '18',
        const no = +segments[segments.length - 2]; // el id viene en la penúltima posición de segments
  
        try {
          await this.pokemonService.create({ name, no });
        } catch (error) {
          //Se muestra el error de item duplicado sin cortar la ejecución
          console.warn(`Pokemon with name "${name}" or no "${no}" already exists`);
        }
      });
  
      await Promise.all(createPromises); //Promise.all(createPromises): Ejecuta todas las inserciones en paralelo.
      return { message: 'Seed executed successfully' };
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
