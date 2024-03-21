import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subscription } from 'src/client/subscription/subscription';
import { PaymentMethod } from 'src/enums/paymentmethod';
import { Status } from 'src/enums/status';

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

  @ManyToOne(() => Subscription, (subscription) => subscription.id)
  subscription: Subscription;

  
}