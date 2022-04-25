import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body.user);
  }

  @Post('signup')
  async signup(@Request() req) {
    return this.authService.signup(req.body.user);
  }
}
