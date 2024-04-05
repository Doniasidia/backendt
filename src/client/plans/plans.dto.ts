//plans.dto
import {  IsNotEmpty,  IsNumber,  IsString } from 'class-validator';


export class PlanDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
  

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  nbrseance: number;

  @IsNotEmpty()
  @IsString()
  enligne: string;


}