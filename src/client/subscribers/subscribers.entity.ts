//plans DTO
import { Status } from '@enums/status';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscriber{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  FirstName: string;

  @Column({ nullable: true, unique: true }) 
  email: string | null;

  @Column({unique: true})
  telephone: string; 



  @Column()
  enLigne: string; 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;





}
