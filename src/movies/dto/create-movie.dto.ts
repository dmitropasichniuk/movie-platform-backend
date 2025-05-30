import { IsString, IsNotEmpty, IsArray, IsNumber, IsDateString, IsOptional, IsUrl, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: 'Title не може бути порожнім' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description не може бути порожнім' })
  description: string;

  @IsDateString()
  releaseDate: string;

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsString()
  @IsNotEmpty({ message: 'Director не може бути порожнім' })
  director: string;

  @IsArray()
  @IsString({ each: true })
  cast: string[];

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsUrl()
  posterUrl: string;

  @IsOptional()
  @IsUrl()
  trailerUrl?: string;
}
