// client.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class ClientDTO {
  @IsNotEmpty()
  nomEtablissement: string;

  
  @IsEmail()
  email: string;

  
  @IsPhoneNumber('TN') // Assuming you're using Tunisian phone numbers
  telephone: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  typepack: string;
}
