import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Client } from '@admin/client/client.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subscriberId: number;
  @Column()
  subscriberName : string;
  @Column()
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @ManyToOne(() => Subscriber, subscriber => subscriber.invoices)
  subscriber: Subscriber; 
  @ManyToOne(() => Client, client => client.subscribers)
  createdBy: Client;
}
