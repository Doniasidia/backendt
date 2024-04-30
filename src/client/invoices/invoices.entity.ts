import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subscriberId: number;

  @Column()
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @ManyToOne(() => Subscriber, subscriber => subscriber.invoices)
  subscriber: Subscriber; 
}
