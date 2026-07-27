import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  sidebarCollapsed = input<boolean>(false);
  isMobile = input<boolean>(false);
  toggleSidebar = output<void>();

  constructor(public authService: AuthService) {}
}
