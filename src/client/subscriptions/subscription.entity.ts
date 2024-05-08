import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PaymentMethod } from '@enums/paymentmethod';
import { Status } from '@enums/status';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  amount: number; 
  @Column()
  clientName: string;
  @Column({ nullable: true})
  planName?: string;
  @ManyToOne(() => Subscriber, subscriber => subscriber.subscriptions)
  subscriber: Subscriber; 

  @Column({ nullable: true })
  groupName: string;
  

  
}