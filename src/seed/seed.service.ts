import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: HttpService,
    
  ){}
  /*
  async executeSeed() {

    this.pokemonService.deleteAll();

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20'),
      );
  
      const createPromises = data.results.map(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
  
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
  */

  async executeSeed() {

    //Borramos todos de antemano para evitar duplicados
    await this.pokemonModel.deleteMany({});

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=8'),
      );
      //Generamos un array de CreatePokemonDto 
      const pokemonToInsert: CreatePokemonDto[] = [];
  
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/'); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '18',
        const no = +segments[segments.length - 2]; // el id viene en la penúltima posición de segments
  
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
