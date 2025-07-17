import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Index,
} from "typeorm";

import { GenreEntity } from "genre/entities";

@Entity("movies")
export class MovieEntity {
  // Ids
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  externalId: number;

  // Main info
  @Index()
  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, length: 500 })
  description: string;

  @Index()
  @Column({ nullable: false, type: "date" })
  releaseDate: string;

  @Column({ nullable: true, length: 20 })
  originalLanguage: string;

  @Column({ nullable: true })
  adult?: boolean;

  // imgs
  @Column({ nullable: false, length: 200 })
  posterPath: string;

  @Column({ nullable: false, length: 200 })
  backdropPath: string;

  // Trailer
  @Column({ length: 250, nullable: true })
  videoId?: string;

  // Genre
  @ManyToMany(() => GenreEntity)
  @JoinTable()
  genres: GenreEntity[];

  // Statistics
  @Index()
  @Column({
    nullable: true,
    type: "decimal",
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  popularity?: number;

  @Index()
  @Column({
    nullable: true,
    type: "decimal",
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  voteAverage: number;

  @Column({ nullable: true, type: "int" })
  voteCount: number;
}
