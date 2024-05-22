//plans entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Group } from '@client/groups/groups.entity';
import { group } from 'console';
import { Client } from '@admin/client/client.entity';

@Entity()
export class Plan{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'decimal'})
amount: number;

  

  @Column({ type: 'time', nullable: true })
  duration: string;
   
  @Column()
  nbrseance: number; 
  @Column()
  enligne: string; 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;


  @Column({type: "date",nullable:true }) 
startDate?: Date;

@Column({ type: "date",nullable:true }) 
endDate?: Date;
@OneToMany(() => Subscriber, subscriber => subscriber.plan) // One plan has many subscribers
  subscribers: Subscriber[]; 
  @ManyToMany(() => Client, client => client.plans)
  @JoinTable()
  clients: Client[];
  @OneToMany(() => Group, group => group.plan) // One plan has many groups
  groups: Group[];
  @ManyToOne(() => Client, client => client.plans)
  createdBy: Client;
}
