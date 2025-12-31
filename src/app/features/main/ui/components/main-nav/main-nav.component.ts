import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainAppService } from '@main/services/main-app-service';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { Subscription } from 'rxjs';
import { ModalBgComponent } from '../modal-bg/modal-bg.component';
import { mainMenuData } from '@content/menus/main-menu-data';
import { MenuItem } from '@content/menus/user-menu-data';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ContainerComponent, ModalBgComponent],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.css',
})
export class MainNavComponent {
  public menuItems: MenuItem[] = [];
  private isLoggedIn: boolean = false;
  private subscriptions: Subscription[] = [];
  isMenuOpen: boolean = false;

  constructor(
    private _mainAppService: MainAppService,
    private _authProviderService: AuthProviderService,
    private _audioService: AudioService
  ) {}

  private setNavMenuData() {
    this.menuItems = mainMenuData.filter(item => {
      if (item.isLoggedInOnly && !this.isLoggedIn) {
        return false;
      }
      return true;
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this._mainAppService.isMenuOpenObs.subscribe((data: boolean) => {
        this.isMenuOpen = data;
      })
    );
    this.subscriptions.push(
      this._authProviderService.isLoggedInObs.subscribe(
        (data: boolean | null) => {
          if (data !== null) {
            this.isLoggedIn = data;
            this.setNavMenuData();
          }
        }
      )
    );
    this.setNavMenuData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleToggleMenu() {
    this._mainAppService.toggleMenu();
  }
  handleClickSound() {
    this._audioService.playSound('click1');
  }
}
