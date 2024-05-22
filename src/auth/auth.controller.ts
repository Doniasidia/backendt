//auth.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, BadRequestException, Param, UsePipes, ValidationPipe, Patch } from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/signInDto';
import { Role } from '@enums/role';
import { ResponseCode } from '@src/common/interfaces/responsecode.interface';
import { ResponseError, ResponseSuccess } from '@src/common/dto/response.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string, role?: Role, redirectTo: string, username: string, userId: number }> {
    const { email } = signInDto;

    if (!email) {
      throw new BadRequestException('Either email or telephone must be provided');
    }

    const emailOrTelephone = email;

    const { access_token, role, redirectTo, username, userId } = await this.authService.signIn(emailOrTelephone, signInDto.password);

    return { access_token, role, redirectTo, username, userId };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('subscriber/verify/:token')
  async verifySubscriberEmail(@Param('token') token: number): Promise<Object> {
    try {
      var isEmailVerified = await this.authService.verifySubscriberEmail(token);
      return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, isEmailVerified);
    } catch (error) {
      return new ResponseSuccess(ResponseCode.RESULT_FAIL, error);
    }
  }

  @Get('client/verify/:token')
  async verifyClientEmail(@Param('token') token: number): Promise<Object> {
    try {
      var isEmailVerified = await this.authService.verifyClientEmail(token);
      return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, isEmailVerified);
    } catch (error) {
      return new ResponseSuccess(ResponseCode.RESULT_FAIL, error);
    }
  }

  @Get('email/forgot-password/:email')
  async sendEmailForgotPassword(@Param('email') email: string): Promise<Object> {
    try {
      var isEmailSent = await this.authService.sendEmailForgotPassword(email);
      if (isEmailSent) {
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, null);
      } else {
        return new ResponseError(ResponseCode.RESULT_FAIL, "Email has not been sent");
      }
    } catch (error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "Error when sending email");
    }
  }

  @Patch('subscriber/reset-password/:token')
  async subscriberResetPassword(@Param('token') token: number, @Body() body: { password: string }) {
    try {
      await this.authService.subscriberResetPassword(token, body.password);
      return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, null);
    } catch (error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "Unexpected error happen");
    }
  }

  @Patch('client/reset-password/:token')
  async clientResetPassword(@Param('token') token: number, @Body() body: { password: string }) {
    try {
      await this.authService.clientResetPassword(token, body.password);
      return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, null);
    } catch (error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "Unexpected error happen");
    }
  }
}
