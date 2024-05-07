// client.entity.ts


import { User } from "@user/user.entity";
import { Role } from "@enums/role";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscriber } from "@client/subscribers/subscribers.entity";
import { Plan } from "@client/plans/plans.entity";
import { group } from "console";
import { Group } from "@client/groups/groups.entity";


@Entity()
export class Client extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typepack: string;

  @Column({ type: "enum", enum: Role, default: Role.CLIENT })
  role: Role;

  
  @OneToMany(() => Plan, plan => plan.createdBy) // One user (created by) can have many subscribers
  plans:Plan[];
  @OneToMany(() => Group, group => group.createdBy) // One user (created by) can have many subscribers
  groups:Group[];
  @ManyToMany(() => Subscriber, subscriber => subscriber.clients) // Many clients can have many subscribers
  subscribers: Subscriber[];
}
