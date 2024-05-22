import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subscriber)
  subscriber: Subscriber;

  @Column()
  type: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  daysBefore: string;
}
