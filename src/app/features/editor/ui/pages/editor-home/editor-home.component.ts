import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { TableComponent } from '@app/features/main/ui/components/table/table.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { FieldLabel, Game, Link } from '@main/interfaces/types';
import { TableCellDisplayType } from '@main/interfaces/enums';
import { AuthGoogleService } from '@app/features/auth/services/auth-google-service';
import { NewGameModalComponent } from '../../components/new-game-modal/new-game-modal.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { User } from '@app/features/auth/interfaces/types';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

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
    private _gameEditorService: GameEditorServiceService,
    private titleService: Title,
    private metaService: Meta
  ) {}
  private subscriptions: Subscription[] = [];

  title = 'Editor Page';
  description = 'This page lists your current games.';
  isMenuOpen: boolean = false;
  games: any[] = [];
  isLoading: boolean = false;
  user: User | null = null;

  breadcrumbLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Game Editor' },
  ];

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameEditorService.gamesObs.subscribe((data: Game[]) => {
        this.games = data;
      })
    );

    this.subscriptions.push(
      this._gameEditorService.isLoadingObs.subscribe((data: boolean) => {
        this.isLoading = data;
      })
    );

    this.subscriptions.push(
      this._authService.userObs.subscribe((data: any) => {
        this.user = data;
        this._gameEditorService.getGamesByUserId(this.user);
      })
    );

    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: 'description',
      content: this.description,
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleNewGameModal() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  itemFieldLabels: FieldLabel[] = [
    {
      label: 'Title',
      field: 'title',
      displayType: TableCellDisplayType.String,
    },
    {
      label: 'Description',
      field: 'description',
      displayType: TableCellDisplayType.String,
    },
    {
      label: 'Status',
      field: 'itemStatus',
      displayType: TableCellDisplayType.StatusChip,
    },
  ];
}
