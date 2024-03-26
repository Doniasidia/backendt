import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Client } from '@admin/client/client.entity';

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