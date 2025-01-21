import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/registration')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() dto: CreateUserDto, @Res() response: Response) {
    await this.userService.registerUser(dto);
    response.send({ message: 'User created successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
}
