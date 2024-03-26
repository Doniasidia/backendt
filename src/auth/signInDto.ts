import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
export class SignInDto {
  @IsEmail()
  email: string;

  
  @IsPhoneNumber('TN') // Assuming you're using Tunisian phone numbers
  telephone: string;

  @IsNotEmpty()
  password: string;
  }
  