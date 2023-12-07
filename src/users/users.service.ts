import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const userToCreateData = {
        name: createUserDto.name,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
      };
      const user = this.userRepository.create(userToCreateData);
      const savedUser = await this.userRepository.save(user);

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async validateUser(email: string, password: string) {
    const user = this.userRepository.findOneBy({ email, password });
    if (user) {
      return { ...user, password: undefined };
    }
    return undefined;
  }
}
