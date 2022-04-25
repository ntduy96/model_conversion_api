import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}

  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        name: name,
      },
    });
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const auth = await this.validateUser(user.username, user.password);
    const payload = { id: auth.id, name: auth.name };
    return {
      access_token: this.jwtService.sign(payload),
      id: auth.id,
      name: auth.name,
    };
  }

  async signup(user: any) {
    const existed = await this.prisma.user.findFirst({
      where: {
        name: user.username,
      },
    });
    if (existed) {
      return {
        result: false,
        error: 'user existed',
      };
    }
    const hashed = await bcrypt.hash(user.password, 10);
    const auth = await this.prisma.user.create({
      data: {
        name: user.username,
        password: hashed,
      },
    });
    return {
      result: 'success',
      id: auth.id,
      name: auth.name,
    };
  }
}
