//abonnements. entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';


@Entity()
export class Abonnement{
  @PrimaryGeneratedColumn()
  id: number;

  @Column ({unique: true})
  name: string;



 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;
  




}
