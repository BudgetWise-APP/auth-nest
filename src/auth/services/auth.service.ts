import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async generateToken(user: {
    userId: Types.ObjectId;
    email: string;
    name: string;
  }) {
    return this.jwtService.sign({
      userId: user.userId.toString(),
      email: user.email,
      name: user.name,
    });
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }

    async registerUser(dto: CreateUserDto): Promise<User> {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = new this.userModel({
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      });
      return user.save();
    }
  
    async getAllUsers(): Promise<User[]> {
      return this.userModel.find().exec();
    }
  
    async findById(id: string): Promise<UserDocument | null> {
      return await this.userModel.findById(id).exec();
    }
  
    async findByEmail(email: string): Promise<UserDocument | null> {
      return this.userModel.findOne({ email }).exec();
    }
  
    async validatePassword(
      enteredPassword: string,
      storedPassword: string,
    ): Promise<boolean> {
      return bcrypt.compare(enteredPassword, storedPassword);
    }
}
