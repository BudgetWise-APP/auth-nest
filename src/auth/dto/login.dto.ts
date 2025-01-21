import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'user@user.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: '12345', description: 'User password' })
  password: string;
}
