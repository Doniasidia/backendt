import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { PaymentMethod } from '@enums/paymentmethod';
import { Status } from '@enums/status';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Invoice } from '@client/invoices/invoices.entity';

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
   
  @OneToOne(() => Invoice, invoice => invoice.subscription)
  @JoinColumn() 
  invoice: Invoice; 
 @Column({ type: "enum", enum: Status, default: Status.ACTIVATED })
  status: Status;
  
}