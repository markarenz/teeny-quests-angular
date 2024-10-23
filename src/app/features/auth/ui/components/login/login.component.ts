import { Component, inject } from '@angular/core';
import { AuthGoogleService } from '@app/features/auth/services/auth-google-service';
import { CommonModule } from '@angular/common';
import { userMenuData } from '@content/menus/user-menu-data';
import { Subscription } from 'rxjs';

// const MODULES: any[] = [
//   MatButtonModule,
//   MatIconModule,
//   MatFormFieldModule,
//   FormsModule,
//   ReactiveFormsModule,
// ];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthGoogleService);

  // profile = this.authService.profileObj;
  subscription: Subscription;
  userProfile: any = null;
  isLoggedIn: boolean = false;
  menuItems: any[] = [];

  constructor(private _authService: AuthGoogleService) {
    this.subscription = Subscription.EMPTY;
  }

  ngOnInit() {
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
      case 'signOut': {
        this.signOut();
        break;
      }
      default:
        break;
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
    // redirect if needed
  }
}
