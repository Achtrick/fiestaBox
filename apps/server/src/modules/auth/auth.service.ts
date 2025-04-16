import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
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

    const payload = { sub: user._id, email: user.email };

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

    // Generate a unique verification token – here we simply use a UUID.
    const verificationToken = uuidv4();

    // Create a new user. (Assume isVerified is false by default).
    const user = await this.usersService.create({
      email: signupDto.email,
      password: hashedPassword,
      name: signupDto.name,
      phone: signupDto.phone,
      role: UserRole.USER,
      isVerified: false,
      verificationToken, // store this token on the user record
    });

    //Send email verification link with the token.
    const verificationUrl = `${process.env.SERVER_HOST}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/verify?token=${verificationToken}`;

    await this.mailerService.sendVerificationEmail(
      user.email,
      verificationUrl
      // `Please verify your email by visiting: ${verificationUrl}`
    );

    return {
      message:
        'User registered successfully. Check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    // Find the user by verification token.
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = null; // Clear the token once it's been used
    await this.usersService.update(user._id as string, user);

    return { message: 'Email verified successfully!' };
  }
}
