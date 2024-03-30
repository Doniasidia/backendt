import { IsNotEmpty, IsEmail, IsPhoneNumber, IsOptional, IsString } from 'class-validator';
export class SignInDto {
  @IsOptional()
  @IsEmail()
  email: string;


  @IsOptional()
  @IsPhoneNumber('TN')
  telephone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  }
  