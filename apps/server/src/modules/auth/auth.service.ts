import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { UserRole } from '@dto-interfaces';
import { MailerService } from '../../common/mail/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Optionally check that the user has been verified:
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto) {
    // Check if the email exists, optionally.
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.usersService.create({
      email: signupDto.email,
      password: hashedPassword,
      name: signupDto.name,
      phone: signupDto.phone,
      role: UserRole.USER,
      isVerified: false,
    });

    const verificationToken = this.jwtService.sign(
      { sub: user._id, type: 'emailVerify' },
      { expiresIn: '24h', secret: process.env.JWT_VERIFY_SECRET }
    );

    //Send email verification link with the token.
    const verificationUrl = `${process.env.SERVER_HOST}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/verify?token=${verificationToken}`;

    await this.mailerService.sendVerificationEmail(user.email, verificationUrl);

    return {
      message:
        'User registered successfully. Check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFY_SECRET,
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Ensure the token has the correct type
    if (payload.type !== 'emailVerify') {
      throw new BadRequestException('Invalid verification token');
    }

    // Retrieve the user by the id encoded in the token
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user's verification status
    if (!user.isVerified) {
      user.isVerified = true;
      await this.usersService.update(user._id as string, user);
    }

    return { message: 'Email verified successfully!' };
  }
}
