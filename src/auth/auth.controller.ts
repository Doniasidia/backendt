import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/signInDto';
import { Role } from '@enums/role';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string, role?: Role, redirectTo: string, username: string }> {
    const { email } = signInDto;

    if (!email) {
      throw new BadRequestException('Either email or telephone must be provided');
    }

    const emailOrTelephone = email;

    const { access_token, role, redirectTo, username } = await this.authService.signIn(emailOrTelephone, signInDto.password);

    return { access_token, role, redirectTo, username };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
