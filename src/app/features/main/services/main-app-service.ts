import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainAppService {
  private isMenuOpen = new BehaviorSubject<boolean>(false);
  isMenuOpenObs = this.isMenuOpen.asObservable();

  constructor() {
    this.isMenuOpen.next(false);
  }

  toggleMenu() {
    this.isMenuOpen.next(!this.isMenuOpen.value);
  }
}
