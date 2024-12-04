import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/shared/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter
    
  ){}
  async executeSeed() {

    //Borramos todos de antemano para evitar duplicados
    await this.pokemonModel.deleteMany({});

    try {
      const data = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=400');
      //Generamos un array de CreatePokemonDto 
      const pokemonToInsert: CreatePokemonDto[] = [];
  
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '5', '' ]
        const no = +segments[segments.length - 2];
        // el id viene en la penúltima posición de segments
  
        pokemonToInsert.push({name, no});
      });
      
      //Insertamos el array en una sola consulta
      this.pokemonModel.insertMany(pokemonToInsert);
      return { message: 'Seed executed successfully' };
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
