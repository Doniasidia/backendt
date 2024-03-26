// client.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  
  @IsEmail()
  email: string;

  
  @IsPhoneNumber('TN') 
  telephone: string;

  @IsNotEmpty()
  password: string;

 

}
