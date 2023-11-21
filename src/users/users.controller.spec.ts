/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAll: () => {
        return Promise.resolve([
          {
            firstname: 'a',
            lastname: 'a',
            username: 's',
            email: 'a@a.com',
            password: 'ac12',
          },
        ]);
      },
      findOne: (_email: string) => {
        return Promise.resolve({
          firstname: 'b',
          lastname: 'b',
          username: 'b',
          email: 'b@b.com',
          password: 'ac12',
        });
      },
      update: (_id: string, _user: Partial<User>) => {
        return Promise.resolve({
          firstname: 'a',
          lastname: 'a',
          username: 's',
          email: 'a@a.com',
          password: 'ac12',
        });
      },
      remove: (_id: string) => {
        return Promise.resolve({ statusCode: 204, message: 'Deleted...' });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('(findAll) should return a list of users', async () => {
    const users = await controller.findAll();
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@a.com');
  });

  it('(findOne) should return a user with the given id', async () => {
    const user = await controller.findOne('b');
    expect(user).toBeDefined();
    expect(user.firstname).toEqual('b');
  });

  it('(findOne) should throw an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findOne('1');
    } catch (error) {
      expect(error).toEqual(new NotFoundException('No user with id 1 found'));
    }
  });
});
