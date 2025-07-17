import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieEntity } from "movies/entities";

@Entity("genres")
export class GenreEntity {
  // Ids
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "int", unique: true })
  externalId: number;

  @Column({ length: 100, unique: true })
  name: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.genres)
  movies: MovieEntity[];
}
