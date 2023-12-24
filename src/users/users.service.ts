import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import { AuthService } from 'src/auth/auth.service';
import { SignupDto } from './dto/signup.dto';
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService
  ) {}

  public async signup (signupDto: SignupDto): Promise<User> {
    const user = new this.usersModel(signupDto)
    return user.save()
  }

  public async signin (signinDto: SignupDto): Promise<{
    name: string, jwtToken: string, email: string
  }> {
    const  user = await this.findByEmail(signinDto.password)
    const match = await this.checkPassword(signinDto.password, user)
  
    if (!match) {
      throw new NotFoundException('Invalid credentials')
    }

    const jwtToken = await this.authService.createAccessToken(user._id)

    return {
      name: user.name, 
      jwtToken: jwtToken, 
      email: user.email
    }
  }

  public async findAll (): Promise<User[]> {
    return this.usersModel.find()
  }

  private async findByEmail (email: string): Promise<User> {
    const user =  await this.usersModel.findOne({ email })

    if (!user) {
      throw new NotFoundException('Email not found')
    }

    return user
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new NotFoundException('Password not found')
    }

    return match
  }
}
