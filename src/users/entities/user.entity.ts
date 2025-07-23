import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  Index,
  Check,
} from "typeorm";
import { Exclude } from "class-transformer";
import * as bcrypt from "bcrypt";

import { MovieEntity } from "@movies";
import { UserRole } from "@enums";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true, length: 255 })
  userName: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email: string;

  @Column({ nullable: false, select: false })
  @Exclude()
  password: string;

  @Column({ nullable: true, length: 255 })
  firstName?: string;

  @Column({ nullable: true, length: 255 })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, type: "int" })
  @Check("age >= 0 AND age <= 120")
  age?: number;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @Index()
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @Index()
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true, type: "varchar", length: 500 })
  avatar?: string;

  @ManyToMany(() => MovieEntity, { eager: true })
  @JoinTable()
  favouriteMovies?: MovieEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && !this.password.startsWith("$2b$")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
