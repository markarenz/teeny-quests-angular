import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { TableComponent } from '@app/features/main/ui/components/table/table.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { FieldLabel, Link } from '@main/interfaces/types';
import { AuthGoogleService } from '@app/features/auth/services/auth-google-service';
import { NewGameModalComponent } from '../../components/new-game-modal/new-game-modal.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { gamesApiUrl } from '@config/index';

@Component({
  selector: 'app-editor-home',
  standalone: true,
  imports: [
    MainLayoutComponent,
    ContainerComponent,
    ButtonComponent,
    TableComponent,
    NewGameModalComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './editor-home.component.html',
  styleUrl: './editor-home.component.css',
})
export class EditorHomeComponent {
  constructor(
    private _authService: AuthGoogleService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.subscription = Subscription.EMPTY;
  }
  title = 'Editor Page';
  description = 'This page lists your current games.';

  games: any[] = [];
  isMenuOpen: boolean = false;

  subscription: Subscription;
  user: any = null;

  breadcrumbLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Game Editor' },
  ];

  ngOnInit(): void {
    this.subscription = this._authService.userObs.subscribe((data: any) => {
      this.user = data;
      // get user's games
      fetch(`${gamesApiUrl}?userId=${this.user.id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
        .then((res) => res.json())
        .then((responseObj) => {
          this.games = responseObj?.items ?? [];
        });
    });

    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: 'description',
      content: this.description,
    });
  }

  toggleNewGameModal() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  items: any = [
    {
      userName: 'Test User',
      description: 'Test game description. Lorem ipsum.',
      id: 'cVqIAMDvgGQMdfETCneVZTn-pVWxDEb5NsZizkDUmbQ',
      title: 'Test Game 10',
    },
    {
      userName: 'Test User',
      description: 'Another description.',
      id: 'cVqIAMDvgGQMdfETCneVZTn-pVWxDEb5NsZizkDUmb2',
      title: 'Test Game 11',
    },
  ];

  itemFieldLabels: FieldLabel[] = [
    {
      label: 'Title',
      field: 'title',
    },
    {
      label: 'Description',
      field: 'description',
    },
  ];
}
