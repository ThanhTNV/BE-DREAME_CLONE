import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { JwtAuthGuard } from './jwt-auth-guard.guard';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [HeaderApiKeyStrategy, AuthService, JwtAuthGuard, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
