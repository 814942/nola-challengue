import { Entity, Column, ManyToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty({
    description: 'Email del usuario.',
    example: 'jon@houses.com',
    required: true,
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña de acceso.',
    example: 'Win3r1sC0mm1nG',
    required: true,
    minLength: 6,
    maxLength: 50,
  })
  // @Exclude()
  @Column({ select: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
