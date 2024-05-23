//plans.dto
import {  IsNotEmpty,  IsNumber,  IsString ,IsDate, IsOptional, IsDecimal } from 'class-validator';


export class PlanDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
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

  @IsOptional()
  startDate: Date;

@IsOptional()
  endDate: Date;

}
