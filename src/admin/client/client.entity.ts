import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nomEtablissement: string;
  @Column()
  email: string;
  @Column()
  telephone: string;
  @Column()
  password: string;
  @Column()
  typepack: string;
}
 