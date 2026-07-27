import { Component, output } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css'
})
export class AuthModal {
  close = output<void>();
  login = output<void>();
  register = output<void>();

  onClose() {
    this.close.emit();
  }

  onLogin() {
    this.login.emit();
  }

  onRegister() {
    this.register.emit();
  }
}
