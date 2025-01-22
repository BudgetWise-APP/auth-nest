import { Controller, Post, Body, Res, UsePipes, ValidationPipe, UseGuards, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '../auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ElasticSearchService } from 'src/elasticsearch/elasticsearch.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly elasticService: ElasticSearchService
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;

    if (!email || !password) {
      res.status(400).send({ message: 'Invalid credentials' });
      return;
    }

    const user: UserDocument = await this.authService.findByEmail(email);
    if (!user) {
      await this.elasticService.logAuthError(email);
      res.status(400).send({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await this.authService.validatePassword(
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

    await this.elasticService.logUserLogin(user);
    res.status(200).send({ message: 'Login successful', token });
  }

    @Post('/registration')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User has been created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @UsePipes(new ValidationPipe())
    async createUser(@Body() dto: CreateUserDto, @Res() response: Response) {
      const user: UserDocument = await this.authService.findByEmail(dto.email);
      if (user) {
        response.status(400).send({ message: 'User aleady exists' });
        return;
      }
      await this.authService.registerUser(dto);
      await this.elasticService.logUserCreate(dto);
      response.send({ message: 'User has been created successfully' });
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getById(@Param('id') id: string) {
      return await this.authService.findById(id);
    }
}
