import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const idToken = request.headers['auth-token'];

      if (!idToken) {
        return false;
      }

      const decodedToken = this.jwtService.verify(idToken, {
        publicKey: 'secret',
      });
      const user = this.userService.findOne(decodedToken.id);
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
