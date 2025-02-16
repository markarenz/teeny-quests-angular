import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameROM } from '../interfaces/types';
import { gamesApiUrl } from '@config/index';

@Injectable({
  providedIn: 'root',
})
export class MainAppService {
  private games = new BehaviorSubject<GameROM[]>([]);
  gamesObs = this.games.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoadingObs = this.isLoading.asObservable();

  private isMenuOpen = new BehaviorSubject<boolean>(false);
  isMenuOpenObs = this.isMenuOpen.asObservable();

  constructor() {
    this.isMenuOpen.next(false);
  }

  toggleMenu() {
    this.isMenuOpen.next(!this.isMenuOpen.value);
  }

  // FUTURE: Pagination, search, etc.
  getGamesList(): void {
    this.isLoading.next(true);

    fetch(gamesApiUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((responseObj) => {
        setTimeout(() => {
          this.games.next(responseObj?.items ?? []);
          this.isLoading.next(false);
        }, 1000);
      });
  }
}
