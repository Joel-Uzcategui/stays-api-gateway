import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

import { AUTH_SERVICE } from '../config';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authClient
      .send('auth.register', dto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.authClient
      .send('auth.login', dto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}
