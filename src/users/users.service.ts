import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { GetMovieDto } from './dto/get-movie.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - The data to create a new user.
   * @returns {Promise<User>} The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const SALT_OR_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);

    const createdUser = await this.userModel.create({
      username,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} A list of all users.
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} The user.
   * @throws {NotFoundException} If the user with the given ID is not found.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`No user with id ${id} found`);
    }

    return user;
  }

  /**
   * Retrieves a user by its username.
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<User>} The user.
   */
  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    return user;
  }

  /**
   * Updates a user by ID.
   * @param {string} id - The ID of the user to update.
   * @param {Partial<User>} user - The updated user data.
   * @returns {Promise<User>} The updated user.
   */
  async update(id: string, user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  /**
   * Removes a user by ID.
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<{ statusCode: number; message: string }>} Status indicating success.
   * @throws {NotFoundException} If the user with the given ID is not found.
   */
  async remove(id: string): Promise<{ statusCode: number; message: string }> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException('Could not find product.');
    }

    await this.userModel.deleteOne({ _id: id }).exec();
    return { statusCode: 200, message: 'User deleted successfully.' };
  }

  /**
   * Compares plain and hashed passwords.
   * @param {string} plainPassword - The plain password.
   * @param {string} hashedPassword - The hashed password.
   * @returns {Promise<boolean>} True if passwords match, false otherwise.
   */
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Retrieves users's favourite movies
   * @param {string} userEmail - The email of the user.
   * @returns {Promise<GetMovieDto[]>} the list of the users's favourite movies
   */
  async getFavorites(userEmail: string): Promise<GetMovieDto[]> {
    const user = await this.userModel
      .findOne({ email: userEmail })
      .populate('favorites');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.favorites;
  }

  /**
   * Adds a movie to the users's favourite movies
   * @param {string} userEmail - The email of the user.
   * @returns {Promise<void>}
   */
  async addToFavorites(userEmail: string, movie: GetMovieDto): Promise<void> {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.favorites.some((favMovie) => favMovie.id === movie.id)) {
      user.favorites.push(movie);
      await user.save();
    }
  }

  /**
   * Removes a movie to the users's favourite movies
   * @param {string} userEmail - The email of the user.
   * @returns {Promise<void>}
   */
  async removeFromFavorites(userEmail: string, movieId: number): Promise<void> {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.favorites = user.favorites.filter(
      (favMovie) => favMovie.id !== movieId,
    );
    await user.save();
  }
}
