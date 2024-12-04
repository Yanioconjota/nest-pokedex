import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
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
    private readonly httpService: HttpService,
    private readonly httpAdapter: AxiosAdapter
    
  ){}
  // 1. En este approach importamos el crate de pokemonService para manejar la inserción dentro del bucle de data
  /*
  async executeSeed() {

    await this.pokemonModel.deleteMany({});

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

  // 2. En este approach se maneja la inserción de todos lo items en simultaneo sin importar el servicio y basándonos unicamente en los métodos de inserción que acepta pokemonModel como insertMany en este caso, permitiéndonos tener una mejor perfomance

  /* async executeSeed() {

    //Borramos todos de antemano para evitar duplicados
    await this.pokemonModel.deleteMany({});

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=8'),
      );
      //Generamos un array de CreatePokemonDto 
      const pokemonToInsert: CreatePokemonDto[] = [];
  
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/'); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '5', '' ]
        const no = +segments[segments.length - 2]; // el id viene en la penúltima posición de segments
  
        pokemonToInsert.push({name, no});
      });
      
      //Insertamos el array en una sola consulta
      this.pokemonModel.insertMany(pokemonToInsert);
      return { message: 'Seed executed successfully' };
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  } */

  // 3. Este approach es similar al anterior pero con la diferencia de que se maneja el get a través de un custom http adapter, permitiendo tener una aplicación escalable y fácil de mantener cuando se use una librería de terceros, el adapter nos permite wrappear esa implementación para modificarla o actualizarla en un módulo compartido y reutilizable
  async executeSeed() {

    //Borramos todos de antemano para evitar duplicados
    await this.pokemonModel.deleteMany({});

    try {
      const data = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=8');
      //Generamos un array de CreatePokemonDto 
      const pokemonToInsert: CreatePokemonDto[] = [];
  
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/'); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '5', '' ]
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
