import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { gamesApiUrl } from '@config/index';
import { LogoMainComponent } from '../../components/logo-main/logo-main.component';
import { GameLinkCardComponent } from '../../components/game-link-card/game-link-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ContainerComponent,
    MainLayoutComponent,
    RouterLink,
    LogoMainComponent,
    GameLinkCardComponent,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  games: any[] = [];
  isLoading: boolean = true;
  skeletons: number[] = Array.from({ length: 4 }, (_, i) => i);
  constructor(private titleService: Title, private metaService: Meta) {}

  title = 'Teeny Quests';
  description =
    'Embark on a journey of miniscule proportions, and even make your own game for friends to play.';

  ngOnInit(): void {
    fetch(gamesApiUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((responseObj) => {
        setTimeout(() => {
          this.games = responseObj?.items ?? [];
          this.isLoading = false;
        }, 1000);
      });
    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: 'description',
      content: this.description,
    });
  }
}
