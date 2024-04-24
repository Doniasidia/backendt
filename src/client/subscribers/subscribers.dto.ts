// subscribers.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber,IsString ,  IsOptional} from 'class-validator';

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

 
  @IsOptional()
  groupName: string;

  @IsOptional()
  planName: string;

  @IsOptional()
  planId?: number;

  @IsOptional()
  groupId?: number  ;

}
