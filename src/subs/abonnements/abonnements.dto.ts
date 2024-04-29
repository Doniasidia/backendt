//abonnements.dto
import {  IsNotEmpty,  IsNumber,  IsString ,IsInt} from 'class-validator';


export class AbonnementDTO {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  




  
}
