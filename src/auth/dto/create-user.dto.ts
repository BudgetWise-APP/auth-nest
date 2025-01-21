import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Dou', description: 'User name' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@user.com', description: 'User email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345', description: 'User password' })
  password: string;
}
