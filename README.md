<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descripción

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

