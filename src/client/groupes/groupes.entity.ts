//groupes entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Plan } from '@client/plans/plans.entity';

@Entity()
export class Groupe{
  @PrimaryGeneratedColumn()
  id: number;

  @Column ({unique: true})
  name: string;



  @Column({ nullable: true }) // Add planId column
  planId: number;
  @ManyToOne(() => Plan, plan => plan.subscribers) // Many subscribers belong to one plan
  plan: Plan;
 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;
  @OneToMany(() => Subscriber, subscriber => subscriber.groupe) // One group has many subscribers
  subscribers: Subscriber[];




}
