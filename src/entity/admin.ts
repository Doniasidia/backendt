import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, Column} from 'typeorm';
import { Client } from 'src/admin/client/client.entity';
import { LoginCredentials } from 'src/entity/LoginCredentials'; 
import { User } from './user';

@Entity()
export class Admin extends User{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column({ default: false }) // Assuming isAdmin is a boolean property
  isAdmin: boolean;

  @Column({ default: false }) // Assuming isSuperAdmin is a boolean property
  isSuperAdmin: boolean;
 
  

 
  @OneToMany(() => Client, (client) => client.id) 
  clients: Client[];
 
}