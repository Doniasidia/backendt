import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subscription } from '@client/subscription/subscription.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => Subscription, (subscription) => subscription.id)
  subscription: Subscription;

  
}