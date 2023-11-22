import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop()
  adult: boolean;
  @Prop()
  backdrop_path: string;
  @Prop()
  genre_ids: number[];
  @Prop()
  id: number;
  @Prop()
  original_language: string;
  @Prop()
  original_title: string;
  @Prop()
  overview: string;
  @Prop()
  popularity: number;
  @Prop()
  poster_path: string;
  @Prop()
  release_date: string;
  @Prop()
  title: string;
  @Prop()
  video: boolean;
  @Prop()
  vote_average: number;
  @Prop()
  vote_count: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
