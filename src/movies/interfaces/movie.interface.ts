export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  genreIds: number[];
  popularity: number;
  posterPath: string;
  videoId?: string;
}
