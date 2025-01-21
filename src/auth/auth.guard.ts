import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.auth_token;

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authService.findById(payload.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = { name: user.name, email: user.email, userId: user._id };
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Invalid token ${error.message}`);
    }
  }
}
