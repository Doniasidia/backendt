import { IsNumber, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Status } from '@enums/status';

export class SubscriptionDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  subscriberId?: number;

  @IsOptional()
  @IsString()
  subscriberName?: string;

  @IsString()
  clientName: string;

  @IsOptional()
  @IsString()
  planName?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  groupName?: string;

 

  @IsOptional()
  @IsNumber()
  createdById?: number;
}
