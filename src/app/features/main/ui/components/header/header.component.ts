import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MenuToggleComponent } from '@main/ui/components/menu-toggle/menu-toggle.component';
import { SvgMiniLogoComponent } from '../svg-mini-logo/svg-mini-logo.component';
import { MainAppService } from '@main/services/main-app-service';
import { LoginComponent } from '@app/features/auth/ui/components/login/login.component';
import { Subscription } from 'rxjs';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ContainerComponent,
    MenuToggleComponent,
    RouterLink,
    LoginComponent,
    SvgMiniLogoComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input('title') title = '';

  private subscription: Subscription;
  isMenuOpen: boolean = false;

  constructor(
    private _mainAppService: MainAppService,
    private _audioService: AudioService
  ) {
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

  handleClickSound() {
    this._audioService.playSound('click1');
  }
}
