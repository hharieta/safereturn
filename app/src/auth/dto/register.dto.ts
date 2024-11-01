import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1234567890' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'password' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'user' })
  role: string;
}