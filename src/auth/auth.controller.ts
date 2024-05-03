import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/signInDto';
import { Role } from '@enums/role';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string, role?: Role, redirectTo: string }> {
    const { email } = signInDto;
    
    if (!email) {
      throw new BadRequestException('Either email or telephone must be provided');
    }

    // Delegate sign-in operation to AuthService
    const { access_token, role } = await this.authService.signIn(email, signInDto.password);
    
    // Determine redirect URL based on user's role
    let redirectTo = '/'; // Default redirect URL
    if (role === Role.CLIENT) {
      redirectTo = '/client/dashboard';
    } else if (role === Role.ADMIN) {
      redirectTo = '/admin/dashboard';
    }
    
    return { access_token, role, redirectTo };
  }

  // Other methods...
}
