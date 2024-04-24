//paiement. entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Plan } from '@client/plans/plans.entity';

@Entity()
export class Paiement{
  @PrimaryGeneratedColumn()
  id: number;

  @Column ({unique: true})
  name: string;



 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;
  




}
