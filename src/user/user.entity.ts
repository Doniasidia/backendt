import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany} from 'typeorm'
import { Status } from '@enums/status';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  telephone : string;
  @Column()
  password: string;
 
  @Column({ type: "enum", enum: Status, default: Status.ACTIVATED})
  status: Status;

 
}