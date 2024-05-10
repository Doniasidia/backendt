// client.entity.ts


import { User } from "@user/user.entity";
import { Role } from "@enums/role";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscriber } from "@client/subscribers/subscribers.entity";
import { Plan } from "@client/plans/plans.entity";
import { group } from "console";
import { Group } from "@client/groups/groups.entity";
import { Subscription } from "@client/subscriptions/subscription.entity";
import { Invoice } from "@client/invoices/invoices.entity";


@Entity()
export class Client extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  typepack: string;
  @Column({ nullable: true }) // Optional address line
  addressLine: string;
  @Column({ type: "enum", enum: Role, default: Role.CLIENT })
  role: Role;
  @OneToMany(() => Subscription, subscription => subscription.subscriber)
  subscriptions: Subscription[];
  @ManyToMany(() => Plan, plan => plan.clients) // Many clients can have many plans
  plans: Plan[];
  
  @OneToMany(() => Group, group => group.createdBy) 
  groups:Group[];
  @ManyToMany(() => Subscriber, subscriber => subscriber.clients) 
  subscribers: Subscriber[];
  @OneToMany(() => Invoice, invoice => invoice.createdBy) 
  invoices:Invoice[];
}