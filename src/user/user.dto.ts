// user.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber ,IsOptional} from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('TN') 
  telephone: string;

}