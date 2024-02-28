import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User} from "./User"
@Entity()
export class Payment{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  amount: number;
  @Column()
  paymentstate: string;
  @Column()
  paymentdate: Date;}