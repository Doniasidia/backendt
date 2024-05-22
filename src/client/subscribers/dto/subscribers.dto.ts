// subscribers.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber, IsString, IsOptional } from 'class-validator';

export class SubscriberDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsNotEmpty()
  @IsPhoneNumber('TN')
  telephone: string;

  @IsOptional()
  groupName: string;

  @IsOptional()
  planName: string;

  @IsOptional()
  planId?: number;

  @IsOptional()
  groupId?: number;

}
