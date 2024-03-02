import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Client } from 'src/entity/client';

@Entity()
export class Subplan{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  duration: string; 

  @ManyToOne(() => Client, (client) => client.id)
  client: Client; // Optional: Plan might be created by a specific client


}