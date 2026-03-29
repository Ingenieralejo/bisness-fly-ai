import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Public()
  @Post('uplink')
  async establishUplink(@Body('key') key: string) {
    if (key !== process.env.JWT_SECRET) {
      throw new UnauthorizedException('SECURITY BREACH: Invalid Meta-Architect Key.');
    }

    const payload = { 
      sub: process.env.ADMIN_USER_ID || 'ANTIGRAVITY_GLOBAL', 
      role: 'META_ARCHITECT', 
      clearance: 'OMEGA' 
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'UPLINK ESTABLISHED. WELCOME ANTIGRAVITY.',
      accessToken,
    };
  }
}
