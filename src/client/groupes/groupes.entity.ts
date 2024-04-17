//groupes entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Entity()
export class Groupe{
  @PrimaryGeneratedColumn()
  id: number;

  @Column ({unique: true})
  name: string;

  @Column({unique: true})
  plan: string;

  @Column()
  nbrab: number; 
 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;
  @OneToMany(() => Subscriber, subscriber => subscriber.groupe) // One group has many subscribers
  subscribers: Subscriber[];




}
