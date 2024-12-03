<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

---
### Descripción
---
El repositorio nest-pokedex implementa una API RESTful utilizando el framework NestJS y el ODM Mongoose para gestionar una base de datos MongoDB. La API está diseñada para gestionar información sobre Pokémon, permitiendo a los usuarios realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una colección de Pokémon almacenada en una base de datos.

---

### Dependencias:
- Docker [Descargar](https://docs.docker.com/desktop/setup/install/windows-install/)
- Nest CLI: ```npm i -g @nestjs/cli```
- Imagen de MongoDB

---

## Setup del proyecto

1. Clonar el repositorio
2. Ejecutar:

```bash
$ yarn install
```
3. Levantar la db:
```bash
$ docker compose up -d
```
4. Correr el seed

### Stack usado
- [MongoDB](https://www.mongodb.com/)
- [Nest](https://github.com/nestjs/nest)

## Notas adicionales:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
## Estructura de Carpetas

```
nest-pokedex/
├── src/
│   ├── common/
│   │   └── pipes/
│   │       └── parse-mongo-id.pipe.ts
│   ├── pokemon/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── pokemon.controller.ts
│   │   ├── pokemon.module.ts
│   │   └── pokemon.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── public/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── README.md
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

## Patrón de Diseño

El proyecto sigue el patrón de diseño **Modular** proporcionado por el framework [NestJS](https://nestjs.com/). Este patrón permite organizar el código en módulos altamente cohesivos y desacoplados, facilitando el mantenimiento y escalabilidad de la aplicación.

## Módulos

### Common Module

El módulo `common` contiene componentes y servicios que son utilizados de manera transversal en toda la aplicación. Esto incluye pipes personalizados, filtros de excepciones y otros elementos reutilizables.

### Pokemon Module

El módulo `pokemon` se encarga de la gestión de los Pokémon dentro de la aplicación. Incluye:

- **Controladores**: Definen las rutas y manejan las solicitudes HTTP relacionadas con los Pokémon.
- **Servicios**: Contienen la lógica de negocio para el manejo de datos y operaciones relacionadas con los Pokémon.
- **Entidades**: Definen la estructura de los datos de los Pokémon y su mapeo a la base de datos.
- **DTOs (Data Transfer Objects)**: Especifican la forma de los datos que se envían y reciben a través de las interfaces de la aplicación.

## DTOs y Entidades

Los **DTOs** se utilizan para definir la estructura de los datos que se intercambian entre el cliente y el servidor. Por otro lado, las **entidades** representan las estructuras de datos que se almacenan en la base de datos.

Ejemplo de DTO:

```typescript
export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;
  @IsString()
  @MinLength(1)
  name: string;
}
```

Ejemplo de Entidad:

```typescript
@Schema()
export class Pokemon extends Document {
  //id: number; --> Generated by mongoDB

  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  
  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
```

1. `@Schema()`:
	- Marca la clase como un esquema de Mongoose. Esto indica que la clase se traducirá a un esquema de MongoDB.
	- Al aplicar este decorador, NestJS entiende que esta clase será utilizada para interactuar con MongoDB.

2. Herencia de Document:
	- La clase Pokemon extiende de Document, que es la clase base de Mongoose para representar documentos en una colección.
	- Esto permite que los objetos creados con esta clase tengan métodos de Mongoose como .save(), .update(), etc.

3. Propiedades Decoradas con `@Prop()`:
	- Define las propiedades que tendrán los documentos en la base de datos, junto con sus configuraciones específicas.
	Propiedades:
		- `name`: string: Representa el nombre del Pokémon.
		- `unique`: true: Garantiza que no haya dos documentos en la colección con el mismo valor para esta propiedad.
		- `index`: true: Crea un índice en la base de datos para optimizar las búsquedas basadas en este campo.
		- `no`: number: Representa el número del Pokémon.
		- También tiene `unique` e `index` configurados para garantizar la unicidad y mejorar el rendimiento en consultas.

4. Comentario `id: number`:
	- Aunque la clase no declara explícitamente un campo id, al heredar de Document, Mongoose proporciona automáticamente un campo _id, que es el identificador único del documento generado por MongoDB.

#### Creación del Esquema
```typescript
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
```

1. `SchemaFactory.createForClass(Pokemon)`:
	- Convierte la clase Pokemon en un esquema de Mongoose válido.
	- Genera automáticamente el esquema con base en las decoraciones aplicadas a las propiedades de la clase.

2. Exportación del Esquema:
	- El esquema exportado (PokemonSchema) se utiliza para registrar el modelo en el módulo correspondiente (PokemonModule), como se muestra aquí:
		```typescript
		MongooseModule.forFeature([
			{ name: Pokemon.name, schema: PokemonSchema },
		])
		```

#### Cómo Funciona en Tiempo de Ejecución
1. Modelo de Mongoose:
	- NestJS usa `PokemonSchema` para crear un modelo de Mongoose (por ejemplo, `PokemonModel`).
	- Este modelo permite interactuar con la colección de MongoDB, incluyendo operaciones como `find`, `create`, `update`, etc.

2. Configuraciones de los Campos:
	- `unique: true`: MongoDB aplica restricciones de unicidad a los campos `name` y `no`. Intentar insertar un documento con valores duplicados en cualquiera de estos campos resultará en un error.
	- `index: true`: MongoDB crea índices para estos campos, acelerando las búsquedas basadas en ellos.

3. Documentos Resultantes en MongoDB:
	- Un documento de ejemplo en MongoDB podría verse así:
	```typescript
	{
	  "_id": "648b5d2f9a0e9e001f4d6d1c",
	  "name": "Pikachu",
	  "no": 25,
	  "__v": 0
	}
	```

4. Operaciones Comunes:
	- GET
	```typescript
	async findAll() {
	    const pokemon = await this.pokemonModel.find();
	    return pokemon;
	  }
	```
	- GET
	```typescript
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
	```
	- PATCH
	```typescript
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
	```
	- DELETE
	```typescript
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
	```

## Inyección de Dependencia: pokemonModel en pokemon.service

La inyección de la dependencia `pokemonModel` en `pokemon.service` permite que este servicio interactúe con la base de datos MongoDB utilizando Mongoose.

### Definición del Modelo en pokemon.module.ts

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      }])
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
```

### Inyección del Modelo en pokemon.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}
}
```

#### Explicación:

1. **`@InjectModel(Pokemon.name)`**:
   - Inyecta el modelo registrado en el módulo `PokemonModule`.
   - Usa el nombre `Pokemon.name` para identificar el modelo.

2. **`private readonly pokemonModel: Model<Pokemon>`**:
   - Declara una propiedad privada en la clase para acceder al modelo inyectado.

3. **Uso del modelo**:
   - Interactúa con la colección de MongoDB para realizar operaciones CRUD, por ejemplo:

```typescript
async findAll(): Promise<Pokemon[]> {
  return this.pokemonModel.find().exec();
}
```



## Configuración de Pipes Globales y CORS

En `main.ts` se configura lo siguiente:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
```

## Servicios y Controladores

### pokemon.service.ts

El archivo `pokemon.service.ts` contiene la lógica de negocio relacionada con la gestión de Pokémon.

#### Principales funciones:

- **createPokemon**: Crea un nuevo Pokémon en la base de datos.
- **findAll**: Recupera todos los Pokémon almacenados.
- **findOne**: Busca un Pokémon específico por su ID.
- **update**: Actualiza un Pokémon existente.
- **remove**: Elimina un Pokémon de la base de datos.

#### Ejemplo:

```typescript
async create(createPokemonDto: CreatePokemonDto) {
  const pokemon = this.pokemonRepository.create(createPokemonDto);
  await this.pokemonRepository.save(pokemon);
  return pokemon;
}
```

### pokemon.controller.ts

El archivo `pokemon.controller.ts` define las rutas HTTP para la gestión de Pokémon.

#### Principales rutas:

- **POST /pokemon**: Crea un nuevo Pokémon.
- **GET /pokemon**: Recupera todos los Pokémon.
- **GET /pokemon/:id**: Recupera un Pokémon por ID.
- **PATCH /pokemon/:id**: Actualiza un Pokémon existente.
- **DELETE /pokemon/:id**: Elimina un Pokémon por ID.

#### Ejemplo:

```typescript
@Post()
create(@Body() createPokemonDto: CreatePokemonDto) {
  return this.pokemonService.create(createPokemonDto);
}
```

## Custom Pipes

### parse-mongo-id.pipe.ts

Este pipe personalizado valida y transforma IDs de MongoDB recibidos en las rutas.

#### Ejemplo de implementación:

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoDB ID`);
    }
    return value;
  }
}
```

#### Uso:

```typescript
@Get(':id')
findOne(@Param('id', ParseMongoIdPipe) id: string) {
  return this.pokemonService.findOne(id);
}
```

