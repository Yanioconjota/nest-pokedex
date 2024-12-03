import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(private readonly httpService: HttpService){}
  async executeSeed() {
    try {
      const {data} = await lastValueFrom(
        this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20')
      );
      data.results.forEach(({name, url}) => {
        const segments = url.split("/"); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '18', '' ]
        console.log("", segments);
        const no = +segments[segments.length - 2]; // el id viene en la penúltima posición de segments
        console.log({name, no});
      });
      return data.results;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
