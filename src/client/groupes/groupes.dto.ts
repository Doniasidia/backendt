//groupes.dto
import {  IsNotEmpty,  IsNumber,  IsString } from 'class-validator';


export class GroupeDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  plan: string;

  @IsNotEmpty()
  @IsNumber()
  nbrab: number;



}