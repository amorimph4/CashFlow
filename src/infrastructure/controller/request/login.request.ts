import { IsString, IsNumberString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    description: 'CPF from user that will do login',
  })
  @IsNumberString()
  @Length(11)
  document: string;

  @ApiProperty({
    description: 'OTP code to authenticate',
  })
  @IsString()
  @Length(6)
  password: string;
}
