//groupes.dto
import {  IsNotEmpty,  IsNumber,  IsString ,IsInt} from 'class-validator';


export class GroupeDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  

  planName: string;


  
}
