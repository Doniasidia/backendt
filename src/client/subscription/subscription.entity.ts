import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PaymentMethod } from '@enums/paymentmethod';
import { Status } from '@enums/status';

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

  

  
}