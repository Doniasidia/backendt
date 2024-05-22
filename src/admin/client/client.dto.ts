// client.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber, IsString, IsOptional, IsUrl } from 'class-validator';

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

  @IsOptional()
  typepack: string;

  @IsOptional()
  addressLine?: string;

  @IsOptional()
  description?: string;
}
