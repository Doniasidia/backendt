import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { PaymentMethod } from '@enums/paymentmethod';
import { Status } from '@enums/status';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Invoice } from '@client/invoices/invoices.entity';
import { Client } from '@admin/client/client.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'decimal'})
  amount: number;
  @Column()
  subscriberId?: number;
  @Column({ nullable: true})
  subscriberName : string;
  @Column()
  clientName: string;
  @Column({ nullable: true})
  planName?: string;
  @Column({ type: 'date' , nullable: true})
  startDate?: Date;
  @Column({ type: 'date', nullable: true })
  endDate?: Date;
  @Column({ nullable: true})
  type?: string;
  @ManyToOne(() => Subscriber, subscriber => subscriber.subscriptions)
  subscriber: Subscriber; 
 
  @Column({ nullable: true })
  groupName: string;
   
  @OneToOne(() => Invoice, invoice => invoice.subscription)
  @JoinColumn() 
  invoice: Invoice; 
 @Column({ type: "enum", enum: Status, default: Status.ACTIVATED })
  status: Status;
    @ManyToOne(() => Client, client => client.invoices)
  createdBy: Client;
  
}
