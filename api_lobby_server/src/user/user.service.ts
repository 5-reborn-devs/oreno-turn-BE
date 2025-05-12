import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import Redis from 'ioredis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    if (await this.redis.sismember('users', user.id)) {
      throw new UnauthorizedException('이미 로그인된 유저입니다.');
    }

    const payload = { email, sub: user.id };
    const token = this.jwtService.sign(payload);

    this.redis.hmset(token, { id: user.id, nickname: 'a' });
    this.redis.sadd('users', user.id);

    return {
      access_token: token,
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async gest() {
    const email = 'gest@gest.com';
    const gestId: string = 'gest_' + 1;
    const payload = { email, sub: gestId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
