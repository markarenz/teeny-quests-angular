import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '@app/features/auth/services/auth-google-service';
import { CommonModule } from '@angular/common';
import { MenuItem, userMenuData } from '@content/menus/user-menu-data';
import { Subscription } from 'rxjs';
import { ModalBgComponent } from '@app/features/main/ui/components/modal-bg/modal-bg.component';
import { User } from '@app/features/auth/interfaces/types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ModalBgComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthGoogleService);

  subscription: Subscription;
  user: User | null = null;
  isLoggedIn: boolean = false;
  menuItems: MenuItem[] = [];

  constructor(private _authService: AuthGoogleService, private router: Router) {
    this.subscription = Subscription.EMPTY;
  }

  ngOnInit() {
    this.subscription = this._authService.userObs.subscribe((data: any) => {
      this.user = data;
    });
    this.subscription = this._authService.isLoggedInObs.subscribe(
      (data: any) => {
        this.isLoggedIn = data;
        this.menuItems =
          userMenuData[this.isLoggedIn ? 'loggedIn' : 'loggedOut'];
      }
    );
  }

  handleUserMenuAction(actionName: string) {
    switch (actionName) {
      case 'signIn': {
        this.signInWithGoogle();
        break;
      }
      default:
      case 'signOut': {
        this.signOut();
        break;
      }
    }
  }

  isUserMenuOpen: boolean = false;

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  signInWithGoogle() {
    this.authService.login();
    this.isUserMenuOpen = false;
  }
  signOut() {
    this.isUserMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
