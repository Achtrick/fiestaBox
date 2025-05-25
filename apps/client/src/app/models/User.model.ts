import { UserRole } from '@dto-interfaces';

export class UserLogin {
  email: string;
  password: string;
}

export class UserForgotPassword {
  email: string;
}

export class UserRegister {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export class UserInfo {
  userId: string;
  email: string;
  token: string;
  role: UserRole;
}
