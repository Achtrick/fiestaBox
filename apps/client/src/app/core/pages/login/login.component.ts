import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormHelper } from '../../../helpers/helpers';
import { AuthService } from '../../../services/auth.service';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';

@Component({
  selector: 'login',
  imports: [CommonModule, RouterLink, SvgIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';

  public loading: WritableSignal<boolean> = signal(false);
  public showPassword: WritableSignal<boolean> = signal(false);

  public FormHelper = FormHelper;

  constructor(protected router: Router, private authService: AuthService) {}

  public async login(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    this.loading.set(true);

    await this.authService.login({
      email: this.email,
      password: this.password,
    });

    this.loading.set(false);
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
