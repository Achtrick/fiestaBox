import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormHelper } from '../../../helpers/helpers';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;

  public FormHelper = FormHelper;

  constructor(protected router: Router, private authService: AuthService) {}

  public async login(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    await this.authService.login({
      email: this.email,
      password: this.password,
    });
  }
}
