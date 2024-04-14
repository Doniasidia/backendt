//plans.dto
import {  IsNotEmpty,  IsNumber,  IsString ,IsDate, IsOptional } from 'class-validator';


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
  @IsString()
  duration: string;
  

  @IsNotEmpty()
  @IsNumber()
  nbrseance: number;

  @IsNotEmpty()
  @IsString()
  enligne: string;

  @IsNotEmpty()
  startDate: Date;

@IsNotEmpty()
  endDate: Date;

}
