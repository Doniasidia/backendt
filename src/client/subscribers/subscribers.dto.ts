// subscribers.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber,IsString ,  IsOptional, isNotEmpty} from 'class-validator';

export class SubscriberDTO {
  @IsNotEmpty()
  @IsString()
  nom: string;
  @IsNotEmpty()
  @IsString()
  prenom: string;
    
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsNotEmpty()
  @IsPhoneNumber('TN') 
  telephone: string;

 
  groupName: string;

  
  planName: string;

  
  groupeId: number;

 
  planId: number;

}
