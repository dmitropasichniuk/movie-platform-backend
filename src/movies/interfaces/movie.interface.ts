export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  durationMinutes: number;
  genre: string[];
  director: string;
  cast: string[];
  rating: number;
  posterUrl: string;
  trailerUrl?: string;
}
