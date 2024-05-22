import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Client } from '@admin/client/client.entity';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { Status } from '@enums/status';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subscriberId: number;
  @Column({ nullable: true})
  subscriberName : string;
  @Column()
  clientName : string;
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED })
  status: Status;
  @Column({ type: 'decimal'})
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @OneToOne(() => Subscription, subscription => subscription.invoice)
  subscription: Subscription; 
  @ManyToOne(() => Client, client => client.invoices)
  createdBy: Client;
  @ManyToOne(() => Subscriber, subscriber => subscriber.invoices)
  subscriber: Subscriber; 

}