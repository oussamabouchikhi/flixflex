import { PartialType } from '@nestjs/mapped-types';
import { GetMovieDto } from './get-movie.dto';

export class AddFavouriteMovieDto extends PartialType(GetMovieDto) {}
