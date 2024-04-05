//plans entity
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Plan{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 1 }) 
  amount: number;

  @Column()
  duration: number; 
  @Column()
  nbrseance: number; 
  @Column()
  enligne: string; 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;





}
