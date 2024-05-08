import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subscription } from '@client/subscriptions/subscription.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;



  @ManyToOne(() => Subscription, (subscription) => subscription.id)
  subscription: Subscription;

  
}