import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainAppService } from '@main/services/main-app-service';
import { Subscription } from 'rxjs';
import { ModalBgComponent } from '../modal-bg/modal-bg.component';
import { mainMenuData } from '@content/menus/main-menu-data';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ContainerComponent, ModalBgComponent],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.css',
})
export class MainNavComponent {
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
  menuItems = mainMenuData;
}
