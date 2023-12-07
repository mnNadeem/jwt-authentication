import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return await this.usersService.validateUser(email, password);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new HttpException(
        'User with this email not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const accessTokenData = {
      id: user.id,
      email: user.email,
    };

    return {
      email: user.email,
      access_token: this.jwtService.sign(accessTokenData),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new HttpException(
        'User with this email not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const resetToken = await this.generatePasswordResetToken(user.email);

    const resetLink = `http://example.com/reset-password?token=${resetToken}`;

    await this.emailService.sendPasswordResetEmail(user.email, resetLink);

    return { message: 'Password reset link sent to your email.' };
  }

  async generatePasswordResetToken(email: string) {
    const payload = { email };
    const options = { expiresIn: '1h' };
    return this.jwtService.sign(payload, options);
  }
}
