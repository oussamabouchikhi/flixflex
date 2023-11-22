import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({
  imports: [MoviesModule, UsersModule],
})
export class AppModule {
  constructor() {
    this.setupSwagger();
  }

  private async setupSwagger() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    const config = new DocumentBuilder()
      .setTitle('FlixFlex Movie API')
      .setDescription('API for managing movies/series and user favorites')
      .setVersion('1.0')
      .addTag('movies')
      .addTag('series')
      .addTag('users')
      .addTag('auth')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
  }
}
