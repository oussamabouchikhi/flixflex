import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { Model } from 'mongoose';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('movies')
@Injectable()
export class MoviesService {
  private readonly apiKey: string;

  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
  }

  @ApiOperation({ summary: 'Get all movies from TMDB API' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
    example: 1,
  })
  async getAllMovies(page: number): Promise<any> {
    const response: AxiosResponse = await this.httpService
      .get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: this.apiKey,
          page,
        },
      })
      .toPromise();

    return response.data.results;
  }

  @ApiOperation({ summary: 'Get top movies from TMDB API' })
  @ApiQuery({
    name: 'items',
    type: Number,
    required: false,
    description: 'Number of top movies to retrieve',
    example: 5,
  })
  async getTopMovies(items: number): Promise<any> {
    const response: AxiosResponse = await this.httpService
      .get(`https://api.themoviedb.org/3/movie/top_rated`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .toPromise();

    return response.data.results.slice(0, items);
  }

  @ApiOperation({ summary: 'Search movies on TMDB API' })
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'Search query',
  })
  @ApiBody({ type: String, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Success', type: Object })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async searchMovies(query: string): Promise<any> {
    const response: AxiosResponse = await this.httpService
      .get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: this.apiKey,
          query,
        },
      })
      .toPromise();

    return response.data.results;
  }

  @ApiOperation({ summary: 'Get details of a movie from TMDB API' })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'Movie ID',
  })
  @ApiResponse({ status: 200, description: 'Success', type: Object })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getMovieDetails(id: number): Promise<any> {
    const response: AxiosResponse = await this.httpService
      .get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .toPromise();

    return response.data;
  }

  @ApiOperation({ summary: 'Get trailer of a movie from TMDB API' })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'Movie ID',
  })
  @ApiResponse({ status: 200, description: 'Success', type: Object })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getMovieTrailer(id: number): Promise<any> {
    const response: AxiosResponse = await this.httpService
      .get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .toPromise();

    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer',
    );
    return trailer ? trailer.key : null;
  }
}
