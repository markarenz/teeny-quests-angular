import { Component, Input } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MenuToggleComponent } from '@main/ui/components/menu-toggle/menu-toggle.component';
import { MainAppService } from '@main/services/main-app-service';
import { LoginComponent } from '@app/features/auth/ui/components/login/login.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ContainerComponent,
    MenuToggleComponent,
    RouterLink,
    RouterLinkActive,
    LoginComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input('title') title = '';

  private subscription: Subscription;
  isMenuOpen: boolean = false;

  constructor(private _mainAppService: MainAppService) {
    this.subscription = Subscription.EMPTY;
  }
  ngOnInit() {
    this.subscription = this._mainAppService.isMenuOpenObs.subscribe(
      (data: boolean) => {
        this.isMenuOpen = data;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleToggleMenu() {
    this._mainAppService.toggleMenu();
  }
}
