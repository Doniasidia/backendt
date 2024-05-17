//auth.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, BadRequestException, Param } from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/signInDto';
import { Role } from '@enums/role';
import { ResponseSuccess } from '@src/common/dto/response.dto';
import { ResponseCode } from '@src/common/interfaces/responsecode.interface';

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

  @Get('email/verify/:token')
  async verifyEmail(@Param('token') token: number): Promise<Object> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(token);
      return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, isEmailVerified);
    } catch (error) {
      return new ResponseSuccess(ResponseCode.RESULT_FAIL, error);
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }): Promise<{ message: string }> {
    const { email } = body;
    try {
      await this.authService.forgotPassword(email);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // AuthController - verifyEmail method

// AuthController - verifyEmail method
/*@Get('email/verifi/:token')
async verifiEmail(@Param('token') token: number): Promise<Object> {
    try {
        // Verify email token
        const isEmailVerified = await this.authService.verifyEmail(token);
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, isEmailVerified);
    } catch (error) {
        return new ResponseSuccess(ResponseCode.RESULT_FAIL, error);
    }
}
  */
}
