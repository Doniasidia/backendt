import {Body,Controller,Get,HttpCode,HttpStatus,Post,Request,UseGuards} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/signInDto';
import { Role } from '@enums/role';
  
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string, role?: Role}> {
      return this.authService.signIn(signInDto.email, signInDto.password);
    }
  
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  }