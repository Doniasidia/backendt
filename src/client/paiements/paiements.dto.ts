//paiements.dto
import {  IsNotEmpty,  IsNumber,  IsString ,IsInt} from 'class-validator';


export class PaiementDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  

  planName: string;


  
}
