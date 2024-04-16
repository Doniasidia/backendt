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



}
