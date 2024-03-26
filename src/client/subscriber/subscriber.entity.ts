import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PaymentMethod } from '@enums/paymentmethod';
import { User } from '@user/user.entity';
import { Role } from '@enums/role';

@Entity()
export class Subscriber extends User{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  FirstName: string;
  @Column()
  LastName: string;
  @Column({ type: "enum", enum: PaymentMethod})
  payment_method: PaymentMethod;
  @Column({ type: "enum", enum: Role, default: Role.SUBSCRIBER })
  role?: Role;

}