// client.entity.ts


import { User } from "@user/user.entity";
import { Role } from "@enums/role";
import { Column, Entity, PrimaryGeneratedColumn ,BeforeInsert} from "typeorm";


@Entity()
export class Client extends User{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  typepack: string;
  @Column({nullable:true})
  accountId?: string;
  @Column({ type: "enum", enum: Role, default: Role.CLIENT })
  role: Role;

}

