import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany} from 'typeorm';

import { Role } from 'src/enums/role';
import { Message } from '../entity/message';
import { Status } from 'src/enums/status';
import { Client } from 'src/admin/client/client.entity';
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
  status?: Status;

 
}