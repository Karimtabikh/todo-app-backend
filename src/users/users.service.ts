import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    const saltOrRounds: number = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hash,
      },
    });
  }

  async validateUser(body: { email: string; password: string }) {
    const email = body.email;
    const password = body.password;

    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) return;

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    if (userExists && isMatch) return true;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
