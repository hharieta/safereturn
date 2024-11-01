import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({example: 'user@email.com'})
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({example: 'password'})
  password: string;
}