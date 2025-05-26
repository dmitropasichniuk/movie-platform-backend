import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, length: 500 })
  description: string;

  @Column({ nullable: false, type: 'date' })
  releaseDate: string;

  @Column({ nullable: false })
  durationMinutes: number;

  @Column({ nullable: false, type: 'text', array: true })
  genre: string[];

  @Column({ nullable: true, length: 100 })
  director?: string;

  @Column({ nullable: false, type: 'text', array: true })
  cast: string[];

  @Column({ 
    nullable: true,
    type: 'decimal', 
    precision: 3, 
    scale: 1,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  rating?: number;

  @Column({ nullable: false, length: 200 })
  posterUrl: string;

  @CreateDateColumn({ nullable: false, type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false, type: 'date' })
  updatedAt: Date;

  @Column({length: 250, nullable: true })
  trailerUrl?: string;
}