import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(username: string, pass: string): Promise<any> {
    if (username === 'admin' && pass === 'admin') {
      const payload = { username: username, sub: 1, role: 'admin' };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
