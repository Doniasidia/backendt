import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Calendar } from '@entity/calendar.entity';

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => Calendar, (calendar) => calendar.id)
  calendar: Calendar;

 
}