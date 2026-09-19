import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AUTH_SERVICE } from '../config';
import { CurrentUser } from './decorators';
import { AuthGuard } from './guards/auth.guard';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto, RefreshTokenDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authClient.send('auth.register', dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.authClient.send('auth.login', dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authClient.send('auth.refresh', dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser('sub') userId: string, @Body() dto: RefreshTokenDto) {
    return this.authClient.send('auth.logout', {
      userId,
      refreshToken: dto.refreshToken,
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authClient.send('auth.me', user.sub);
  }
}
