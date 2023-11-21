import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByUsername(createUserDto.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.usersService.comparePasswords(
      createUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const { username, password } = createUserDto;
    const user = await this.usersService.create({ username, password });

    const payload = { username: user.username, sub: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
