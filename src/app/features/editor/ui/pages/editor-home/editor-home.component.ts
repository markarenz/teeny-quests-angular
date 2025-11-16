import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { TableComponent } from '@app/features/main/ui/components/table/table.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { TableField, GameROM, Link } from '@main/interfaces/types';
import { TableCellDisplayType } from '@main/interfaces/enums';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { NewGameModalComponent } from '../../components/new-game-modal/new-game-modal.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { User } from '@app/features/auth/interfaces/types';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

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
    private _authService: AuthProviderService,
    private _gameEditorService: GameEditorService
  ) {}
  private subscriptions: Subscription[] = [];

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
      this._gameEditorService.gamesObs.subscribe((data: GameROM[]) => {
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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleNewGameModal() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  tableFields: TableField[] = [
    {
      label: 'Title',
      field: 'title',
      isLink: true,
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
