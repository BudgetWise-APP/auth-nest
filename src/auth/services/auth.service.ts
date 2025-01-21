import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: {
    userId: Types.ObjectId;
    email: string;
    name: string;
  }) {
    return this.jwtService.sign({
      userId: user.userId.toString(),
      email: user.email,
      name: user.name,
    });
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
