import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PaymentMethod } from '@enums/paymentmethod';
import { Status } from '@enums/status';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  paymentDate: Date;

  @Column({ type: "enum", enum: PaymentMethod})
  payment_method: PaymentMethod;

  @Column({ type: "enum", enum: Status})
  status: Status;

 
  
}