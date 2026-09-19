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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

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
    return this.send('auth.register', dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.send('auth.login', dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.send('auth.refresh', dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser('sub') userId: string, @Body() dto: RefreshTokenDto) {
    return this.send('auth.logout', { userId, refreshToken: dto.refreshToken });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.send('auth.me', user.sub);
  }

  private send(pattern: string, payload: unknown) {
    return this.authClient
      .send(pattern, payload)
      .pipe(
        catchError((error: unknown) =>
          throwError(() => new RpcException(error as string | object)),
        ),
      );
  }
}
