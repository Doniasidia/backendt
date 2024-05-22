// subscribers.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber, IsString, IsOptional } from 'class-validator';

export class CreateSubscriberDTO {

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string | undefined;

    @IsNotEmpty()
    @IsPhoneNumber('TN')
    telephone: string;
}
