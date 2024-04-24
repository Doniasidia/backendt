//groupes.dto
import {  IsNotEmpty,  IsNumber,  IsString ,IsInt, IsOptional} from 'class-validator';


export class GroupDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  

  planName: string;

  @IsOptional()
  planId?: number;
  
}
