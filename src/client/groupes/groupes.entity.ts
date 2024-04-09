//groupes entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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





}
