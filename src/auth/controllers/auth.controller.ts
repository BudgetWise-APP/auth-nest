import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;

    if (!email || !password) {
      res.status(400).send({ message: 'Invalid credentials' });
      return;
    }

    const user: UserDocument = await this.usersService.findByEmail(email);
    if (!user) {
      res.status(400).send({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      res.status(400).send({ message: 'Invalid credentials' });
      return;
    }

    const token = await this.authService.generateToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    // Cookies are passed in the response header but they are not set in the browser because
    // AuthService and Client are running on different URLs
    res.cookie('auth_token', token, {
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: true, // Works only in HTTPS
      sameSite: 'none', // Applies to cross-domain requests
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Cookie lifespan is 1 day
      path: '/', // Cookie is available on all routes
    });

    res.status(200).send({ message: 'Login successful', token });
  }
}
