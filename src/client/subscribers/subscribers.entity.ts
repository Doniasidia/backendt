import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Groupe } from '@client/groupes/groupes.entity';
import { Plan } from '@client/plans/plans.entity';
import { Status } from '@enums/status';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  FirstName: string;

  @Column({ nullable: true, unique: true })
  email: string | null;

  @Column({ unique: true })
  telephone: string;

  @ManyToOne(() => Groupe, groupe => groupe.subscribers) // Many subscribers belong to one group
  groupe: Groupe;

  @ManyToOne(() => Plan, plan => plan.subscribers) // Many subscribers belong to one plan
  plan: Plan;

  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;

  @Column({ nullable: true }) // Add groupId column
  groupeId: number;

  @Column({ nullable: true }) // Add planId column
  planId: number;
}
