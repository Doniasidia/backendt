// client.entity.ts


import { User } from "src/user/user";
import { Role } from "src/enums/role";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client extends User{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  typepack: string;
  @Column({ type: "enum", enum: Role, default: Role.CLIENT })
  role?: Role;
}
 