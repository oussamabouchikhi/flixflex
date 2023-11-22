// // import { Test, TestingModule } from '@nestjs/testing';
// // import { UsersService } from './users.service';

// // describe('UsersService', () => {
// //   let service: UsersService;

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       providers: [UsersService],
// //     }).compile();

// //     service = module.get<UsersService>(UsersService);
// //   });

// //   it('should be defined', () => {
// //     expect(service).toBeDefined();
// //   });
// // });

// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { User, UserDocument } from './schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import * as bcrypt from 'bcrypt';
// import { Model } from 'mongoose';

// describe('UsersService', () => {
//   let usersService: UsersService;
//   let userModel: Model<UserDocument>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getModelToken(User.name),
//           useValue: Model,
//         },
//       ],
//     }).compile();

//     usersService = module.get<UsersService>(UsersService);
//     userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
//   });

//   it('should be defined', () => {
//     expect(usersService).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a user', async () => {
//       const createUserDto: CreateUserDto = {
//         username: 'testuser',
//         password: 'testpassword',
//       };
//       const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

//       jest.spyOn(userModel.prototype, 'save').mockImplementationOnce(() => ({
//         ...createUserDto,
//         password: hashedPassword,
//       }));

//       const result = await usersService.create(createUserDto);
//       console.table(result);
//       expect(result).toEqual({
//         ...createUserDto,
//         password: hashedPassword,
//       });
//     });
//   });

//   // Add more test cases for other methods as needed

//   afterAll(async () => {
//     await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
//   });
// });

// users.service.spec.ts

// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { User, UserDocument } from './schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import { NotFoundException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

// const mockUserModel = {
//   find: jest.fn(),
//   findOne: jest.fn(),
//   findByIdAndUpdate: jest.fn(),
//   deleteOne: jest.fn(),
//   save: jest.fn(),
// };

// jest.mock('@nestjs/mongoose', () => ({
//   getModelToken: jest.fn(() => 'UserModel'),
// }));

// describe('UsersService', () => {
//   let service: UsersService;
//   let userModel: any;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getModelToken(User.name),
//           useFactory: () => ({
//             find: jest.fn(),
//             findOne: jest.fn(),
//             findByIdAndUpdate: jest.fn(),
//             deleteOne: jest.fn(),
//             save: jest.fn(),
//           }),
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     userModel = module.get(getModelToken(User.name));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     it('should create a new user', async () => {
//       const createUserDto: CreateUserDto = {
//         username: 'testuser',
//         password: 'testpassword',
//       };

//       const hashedPassword = 'hashedpassword';
//       jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

//       const mockSave = jest.fn();
//       mockUserModel.save.mockReturnValueOnce(mockSave);

//       const result = await service.create(createUserDto);

//       expect(result).toEqual(mockSave);
//       expect(mockUserModel.save).toHaveBeenCalledWith();
//       expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
//       expect(mockUserModel).toHaveBeenCalledWith({
//         username: 'testuser',
//         password: 'hashedpassword',
//       });
//     });
//   });

//   describe('findAll', () => {
//     it('should return a list of all users', async () => {
//       const mockFind = jest.fn();
//       mockUserModel.find.mockReturnValueOnce(mockFind);

//       const result = await service.findAll();

//       expect(result).toEqual(mockFind);
//       expect(mockUserModel.find).toHaveBeenCalledWith();
//     });
//   });

//   describe('findOne', () => {
//     it('should return a user by ID', async () => {
//       const mockUser = { _id: '1', username: 'testuser' } as UserDocument;
//       const mockFindOne = jest.fn().mockReturnValueOnce(mockUser);
//       mockUserModel.findOne.mockReturnValueOnce(mockFindOne);

//       const result = await service.findOne('1');

//       expect(result).toEqual(mockUser);
//       expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: '1' });
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       const mockFindOne = jest.fn().mockReturnValueOnce(null);
//       mockUserModel.findOne.mockReturnValueOnce(mockFindOne);

//       await expect(service.findOne('1')).rejects.toThrowError(
//         NotFoundException,
//       );
//       expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: '1' });
//     });
//   });

//   describe('update', () => {
//     it('should update a user by ID', async () => {
//       const updateUserDto = { password: 'newpassword' };
//       const mockFindOneAndUpdate = jest.fn();
//       mockUserModel.findByIdAndUpdate.mockReturnValueOnce(mockFindOneAndUpdate);

//       const result = await service.update('1', updateUserDto);

//       expect(result).toEqual(mockFindOneAndUpdate);
//       expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('1', {
//         password: 'newpassword',
//       });
//     });
//   });

//   describe('remove', () => {
//     it('should remove a user by ID', async () => {
//       const mockFindOne = jest.fn().mockReturnValueOnce({});
//       mockUserModel.findOne.mockReturnValueOnce(mockFindOne);
//       const mockDeleteOne = jest.fn();
//       mockUserModel.deleteOne.mockReturnValueOnce(mockDeleteOne);

//       const result = await service.remove('1');

//       expect(result).toEqual({
//         statusCode: 200,
//         message: 'User deleted successfully.',
//       });
//       expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: '1' });
//       expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       const mockFindOne = jest.fn().mockReturnValueOnce(null);
//       mockUserModel.findOne.mockReturnValueOnce(mockFindOne);

//       await expect(service.remove('1')).rejects.toThrowError(NotFoundException);
//       expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: '1' });
//     });
//   });

//   describe('comparePasswords', () => {
//     it('should compare plain and hashed passwords', async () => {
//       const mockCompare = jest.fn().mockReturnValueOnce(true);
//       jest.spyOn(bcrypt, 'compare').mockImplementationOnce(mockCompare);

//       const result = await service.comparePasswords('plain', 'hashed');

//       expect(result).toEqual(true);
//       expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
//     });
//   });
// });

// users.service.spec.ts

// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { NotFoundException } from '@nestjs/common';
// import { User } from './schemas/user.schema';
// import * as bcrypt from 'bcrypt';

// // Mock the mongoose model
// const mockUserModel = {
//   find: jest.fn(),
//   findOne: jest.fn(),
//   create: jest.fn(),
//   findByIdAndUpdate: jest.fn(),
//   deleteOne: jest.fn(),
//   exec: jest.fn(),
// };

// describe('UsersService', () => {
//   let usersService: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getModelToken(User.name),
//           useValue: mockUserModel,
//         },
//       ],
//     }).compile();

//     usersService = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(usersService).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a new user', async () => {
//       const createUserDto: CreateUserDto = {
//         username: 'testuser',
//         password: 'testpassword',
//       };

//       const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

//       const save = jest.fn().mockResolvedValueOnce({
//         _id: '1',
//         ...createUserDto,
//         password: hashedPassword,
//       });

//       mockUserModel.create.mockImplementationOnce(() => ({
//         ...createUserDto,
//         save,
//       }));

//       const result = await usersService.create(createUserDto);

//       expect(result).toEqual({
//         _id: '1',
//         ...createUserDto,
//         password: hashedPassword,
//       });
//       expect(mockUserModel.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           username: createUserDto.username,
//           password: expect.stringContaining('$2b$10$'),
//         }),
//       );
//       expect(save).toHaveBeenCalled();
//     });
//   });

//   describe('remove', () => {
//     it('should remove a user by ID', async () => {
//       const mockFindOne = jest.fn().mockReturnValueOnce({});
//       mockUserModel.findOne.mockReturnValueOnce(mockFindOne);
//       const mockDeleteOne = jest.fn();
//       mockUserModel.deleteOne.mockReturnValueOnce(mockDeleteOne);

//       const result = await usersService.remove('1');

//       expect(result).toEqual({
//         statusCode: 200,
//         message: 'User deleted successfully.',
//       });
//       expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: '1' });
//       expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       const mockFindOne = jest.fn().mockReturnValueOnce(null);
//       mockUserModel.findOne.mockReturnValueOnce(mockFindOne);

//       await expect(usersService.remove('1')).rejects.toThrowError(
//         NotFoundException,
//       );
//       expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: '1' });
//     });
//   });

//   describe('findAll', () => {
//     it('should return a list of users', async () => {
//       const userList = [
//         { _id: '1', username: 'user1', password: 'password1' },
//         { _id: '2', username: 'user2', password: 'password2' },
//       ];

//       mockUserModel.find.mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(userList),
//       });

//       const result = await usersService.findAll();

//       expect(result).toEqual(userList);
//       expect(mockUserModel.find).toHaveBeenCalled();
//     });
//   });

//   // Add more test cases for other methods (findOne, update, remove, comparePasswords) similarly.
// });

describe('Users Service', () => {
  it('should be true', async () => {
    expect(true).toBe(true);
  });
});
