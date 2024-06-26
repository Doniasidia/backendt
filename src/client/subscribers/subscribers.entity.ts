 ///subscriber.entity
 import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
 import { Group } from '@client/groups/groups.entity';
 import { Plan } from '@client/plans/plans.entity';
 import { Status } from '@enums/status';
 import { Invoice } from '@client/invoices/invoices.entity';
 import { Client } from '@admin/client/client.entity';
 import { User } from '@user/user.entity';
 import { Subscription } from '@client/subscriptions/subscription.entity';
 
 @Entity()
 export class Subscriber extends User {
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column()
   firstname: string;
 
   @ManyToOne(() => Group, group => group.subscribers, { nullable: true }) // Many subscribers belong to one group
   group: Group;
 
   @ManyToOne(() => Plan, plan => plan.subscribers, { nullable: true }) // Many subscribers belong to one plan
   plan: Plan;
 
   @Column({ type: "enum", enum: Status, default: Status.ACTIVATED })
   status: Status;
 
   @Column({ nullable: true, default: null }) // Add groupId column
   groupId?: number | null;
 
   @Column({ nullable: true, default: null }) // Add planId column
   planId?: number | null;
 
   @Column({ default: false })
   is_verified: boolean;
 
   @OneToMany(() => Subscription, subscription => subscription.subscriber, { nullable: true }) // One subscriber can have multiple invoices
   subscriptions: Subscription[];
 
   @ManyToOne(() => Client, client => client.subscribers, { nullable: true })
   createdBy?: Client;
 
   
 
   @OneToMany(() => Invoice, invoice => invoice.subscriber, { nullable: true }) // One subscriber can have multiple invoices
   invoices: Invoice[];
   @ManyToMany(() => Client, client => client.subscribers, { cascade: true })
 @JoinTable()
 clients: Client[];
 
 }
  