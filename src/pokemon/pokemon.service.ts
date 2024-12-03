import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) {}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const pokemon = await this.pokemonModel.find();
    return pokemon;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);
    

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {

      await pokemon.updateOne(updatePokemonDto, { new: true });
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // Common delete
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id: ${id} not found`);
      
    }
    return true;
  }

  private handleExceptions(error: any) {
    console.log(error);
    if(error.code === 11000) throw new BadRequestException(`The property (${JSON.stringify(error.keyValue)}) is already used by another Pokemon`);
    
    throw new InternalServerErrorException(`Can't create or update Pokemon - Check Server for logs`);
  }
}
