import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: UsersService;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    usersServiceMock = {
      findOne: jest.fn(),
      findByUsername: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      comparePasswords: jest.fn(),
      create: jest.fn(),
    } as any;

    jwtServiceMock = {
      signAsync: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign in a user', async () => {
    // GIVEN
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'testpassword',
    };
    const userMock = {
      username: 'testuser',
      password: 'hashedpassword',
      email: 'test@test.com',
    };
    const payloadMock = { username: 'testuser', sub: 'test@test.com' };

    (usersServiceMock.findByUsername as jest.Mock).mockResolvedValue(userMock);
    (usersServiceMock.comparePasswords as jest.Mock).mockResolvedValue(true);
    (jwtServiceMock.signAsync as jest.Mock).mockResolvedValue(
      'mockedAccessToken',
    );

    // WHEN
    const result = await service.signIn(createUserDto);

    // THEN
    expect(usersServiceMock.findByUsername).toHaveBeenCalledWith('testuser');
    expect(usersServiceMock.comparePasswords).toHaveBeenCalledWith(
      'testpassword',
      'hashedpassword',
    );
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payloadMock);
    expect(result).toEqual({ access_token: 'mockedAccessToken' });
  });

  it('should throw UnauthorizedException when sign in fails', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    (usersServiceMock.findOne as jest.Mock).mockResolvedValue(null);
    (usersServiceMock.comparePasswords as jest.Mock).mockResolvedValue(false);

    await expect(service.signIn(createUserDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw a ConflictException when trying to signup with an existing username', async () => {
    (usersServiceMock.findByUsername as jest.Mock).mockResolvedValue({
      username: 'existingUser',
      password: 'hashedPassword',
      email: 'existingUser@example.com',
    });

    const mockUser: CreateUserDto = {
      username: 'existingUser',
      password: 'password123',
    };

    await expect(service.signUp(mockUser)).rejects.toThrow(ConflictException);
  });

  it('should sign up a new user and return an access token', async () => {
    (usersServiceMock.findOne as jest.Mock).mockResolvedValue(null);

    (usersServiceMock.create as jest.Mock).mockResolvedValue({
      username: 'newUser',
      password: 'password123',
    });

    (jwtServiceMock.signAsync as jest.Mock).mockResolvedValue(
      'mockedAccessToken',
    );

    const mockUser: CreateUserDto = {
      username: 'newUser',
      password: 'password123',
    };

    const result = await service.signUp(mockUser);
    expect(result.access_token).toBeDefined();
  });
});
