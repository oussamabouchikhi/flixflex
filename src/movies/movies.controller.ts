import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get all movies' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
    example: 1,
  })
  @Get()
  @UseGuards(AuthGuard)
  getAllMovies(@Query('page') page: number = 1): Promise<any> {
    return this.moviesService.getAllMovies(page);
  }

  @ApiOperation({ summary: 'Get top movies' })
  @ApiQuery({
    name: 'items',
    type: Number,
    required: false,
    description: 'Number of top movies to retrieve',
    example: 5,
  })
  @Get('top')
  @UseGuards(AuthGuard)
  getTopMovies(@Query('items') items: number = 5): Promise<any> {
    return this.moviesService.getTopMovies(items);
  }
}
