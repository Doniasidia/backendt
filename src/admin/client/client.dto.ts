// client.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber,IsString } from 'class-validator';

export class ClientDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('TN') 
  telephone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  typepack: string;
}
