import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from 'src/admin/client/client.entity';
import { PaymentMethod } from 'src/enums/paymentmethod';
import { Status } from 'src/enums/status';
import { User } from '../../entity/user';

@Entity()
export class Subscriber extends User{
  @PrimaryGeneratedColumn()
  id: number;
  

  @Column({ type: "enum", enum: PaymentMethod})
  payment_method: PaymentMethod;

  @Column({ type: "enum", enum: Status})
  status: Status;

  @Column()
  inscription_date: Date;
  @Column({ unique: true })
  email? : string;

  

 /* @ManyToOne(() => Client, (client) => client.subscribers)
  client: Client; */
}