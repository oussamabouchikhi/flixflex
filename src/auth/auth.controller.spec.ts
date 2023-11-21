/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      signIn: jest.fn((_signInDto: CreateUserDto) =>
        Promise.resolve({ access_token: 'accessToken' }),
      ),
      signUp: jest.fn((_signUpDto: CreateUserDto) =>
        Promise.resolve({ access_token: 'accessToken' }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('(signIn) should return access token on successful login', async () => {
    const signInDto: CreateUserDto = {
      username: 'johndoe',
      password: 'ac12',
    };

    const result = await controller.signIn(signInDto);
    expect(result).toHaveProperty('access_token');
    expect(authService.signIn).toHaveBeenCalledWith(signInDto);
  });

  it('(signUp) should return access token on successful registration', async () => {
    const signUpDto: CreateUserDto = {
      username: 'johndoe',
      password: 'ac12',
    };

    const result = await controller.signUp(signUpDto);
    expect(result).toHaveProperty('access_token');
    expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
  });

  it('(getProfile) should return user profile when authenticated', async () => {
    const req = { user: { username: 'johndoe', email: 'john@mail.com' } };
    const result = await controller.getProfile(req);
    expect(result).toEqual(req.user);
  });

  it('(getProfile) should throw an error when not authenticated', async () => {
    const req = { user: null };
    try {
      await controller.getProfile(req);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
