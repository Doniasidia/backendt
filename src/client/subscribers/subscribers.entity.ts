//subscriber.entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Status } from '@enums/status';
import { Invoice } from '@client/invoices/invoices.entity';
import { Client } from '@admin/client/client.entity';
import { User } from '@user/user.entity';

@Entity()
export class Subscriber extends User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @ManyToOne(() => Group, group => group.subscribers) // Many subscribers belong to one group
  group: Group;

  @ManyToOne(() => Plan, plan => plan.subscribers) // Many subscribers belong to one plan
  plan: Plan;

  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED })
  status: Status;

  @Column({ nullable: true, default: null }) // Add groupId column
  groupId?: number | null;

  @Column({ nullable: true, default: null }) // Add planId column
  planId?: number | null;

  @OneToMany(() => Invoice, invoice => invoice.subscriber) // One subscriber can have multiple invoices
  invoices: Invoice[];

  @ManyToOne(() => Client, client => client.subscribers)
  createdBy: Client;
}
