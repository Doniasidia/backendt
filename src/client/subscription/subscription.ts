import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subscriber } from 'src/client/subscriber/subscriber';
import { Subplan } from 'src/entity/subplan';
import { PaymentMethod } from 'src/enums/paymentmethod';
import { Status } from 'src/enums/status';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date_debut: Date;

  @Column()
  date_fin: Date;

  @Column()
  montant: number;
  @Column({ type: "enum", enum: PaymentMethod})
  payment_method: PaymentMethod;

  @Column({ type: "enum", enum: Status})
  status: Status;

  @ManyToOne(() => Subscriber, (subscriber) => subscriber.id)
  subscriber: Subscriber;

  @ManyToOne(() => Subplan, (subplan) => subplan.id)
  subplan: Subplan;

  
}