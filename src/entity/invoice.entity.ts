import { PaymentMethod } from '@enums/paymentmethod';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  issueDate: Date;

  @Column()
  dueDate: Date;

  @Column({ type: "enum", enum: PaymentMethod})
  payment_method: PaymentMethod;

 
}