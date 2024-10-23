import { Component } from '@angular/core';
import { MainAppService } from '@main/services/main-app-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-toggle',
  standalone: true,
  imports: [],
  templateUrl: './menu-toggle.component.html',
  styleUrl: './menu-toggle.component.css',
})
export class MenuToggleComponent {
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
}
