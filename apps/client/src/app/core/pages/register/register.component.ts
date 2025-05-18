import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormHelper } from '../../../helpers/helpers';
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../../../services/shared.service';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import {
  ToastAnimation,
  ToastSettings,
  ToastType,
} from '../../components/toast/toast.component';

@Component({
  selector: 'register',
  imports: [CommonModule, RouterLink, SvgIconComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public name: string = '';
  public phone: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  public loading: WritableSignal<boolean> = signal(false);
  public showPassword: WritableSignal<boolean> = signal(false);

  public FormHelper = FormHelper;

  constructor(
    protected router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  public async signup(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (this.password !== this.confirmPassword) {
      const settings = new ToastSettings();
      settings.message = "passwords doesn't match !";
      settings.type = ToastType.Warning;
      settings.animation = ToastAnimation.Slide;
      return this.sharedService.toastSettings.set(settings);
    }
    this.loading.set(true);

    await this.authService.signup({
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
    });

    this.loading.set(false);
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
