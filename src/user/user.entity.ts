//user.entity
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany} from 'typeorm'
import { Status } from '@enums/status';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column({ nullable: true, unique: true }) 
  email: string | null;
  @Column({ unique: true })
  telephone : string;
 
 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;

 
}