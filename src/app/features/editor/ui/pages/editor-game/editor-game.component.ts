import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameROM, Link, SubNavItem } from '@app/features/main/interfaces/types';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@app/features/main/ui/components/container/container.component';
import { EditorPanelInfoComponent } from '../../components/editor-panel-info/editor-panel-info.component';
import { EditorPanelCellsComponent } from '../../components/editor-panel-cells/editor-panel-cells.component';
import { EditorPanelExitsComponent } from '../../components/editor-panel-exits/editor-panel-exits.component';
import { EditorPanelItemsComponent } from '../../components/editor-panel-items/editor-panel-items.component';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { EditorAreaComponent } from '../../components/editor-area/editor-area.component';
import { EditorAreaSelectorComponent } from '../../components/editor-area-selector/editor-area-selector.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { ContentVersionsModalComponent } from '../../components/content-versions-modal/content-versions-modal.component';

@Component({
  selector: 'app-editor-game',
  standalone: true,
  imports: [
    ContainerComponent,
    MainLayoutComponent,
    LoaderAnimationComponent,
    FormsModule,
    ButtonComponent,
    BreadcrumbsComponent,
    EditorAreaComponent,
    EditorAreaSelectorComponent,
    EditorPanelInfoComponent,
    EditorPanelExitsComponent,
    EditorPanelCellsComponent,
    EditorPanelItemsComponent,
    ContentVersionsModalComponent,
  ],
  templateUrl: './editor-game.component.html',
  styleUrl: './editor-game.component.css',
})
export class EditorGameComponent {
  private subscriptions: Subscription[] = [];
  public isContentVersionModalOpen: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _gameEditorService: GameEditorService,
    private _authGoogleService: AuthProviderService,
    private router: Router
  ) {}

  title = 'Editor Game';
  isLoading: boolean = false;
  isValid: boolean = false;
  game: GameROM | null = null;

  breadcrumbLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Game Editor', href: '/editor' },
    { label: 'Editing Game' },
  ];

  subNavCurrent: string = 'info';
  subNavLinks: SubNavItem[] = [
    { label: 'Info', slug: 'info' },
    { label: 'Map', slug: 'map' },
    { label: 'Exits', slug: 'exits' },
    { label: 'Items', slug: 'items' },
    { label: 'NPCs', slug: 'npcs' },
  ];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        const userId = this._authGoogleService.getUserId();
        if (data && data.userId !== userId) {
          this.router.navigate(['/']);
          return;
        }
        this.game = data;
        this.title = this.game?.title ?? 'Game Title';
      })
    );

    const id = this._route.snapshot.paramMap.get('id');
    this._gameEditorService.getGameById(id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async handleSaveClick() {
    this.isLoading = true;
    await this._gameEditorService.saveGame(this.game!);
    this.isLoading = false;
  }

  handleSubNavClick(slug: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem('');
    this.subNavCurrent = slug;
  }

  handleSelectItem(id: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem(id);
    this.subNavCurrent = 'items';
  }

  handleSelectExit(id: string) {
    this._gameEditorService.selectItem('');
    this._gameEditorService.selectExit(id);
    this.subNavCurrent = 'exits';
  }

  handleSelectMapCell(id: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem('');
    this._gameEditorService.setSelectedCellPosition(id);
    this.subNavCurrent = 'map';
  }
  handlePlayClick() {
    localStorage.removeItem(`save--${this.game?.id ?? ''}`);
    this.router.navigate([`/game/${this.game?.id ?? ''}`]);
  }

  public handleContentVersionModalToggle(isOpen: boolean) {
    this.isContentVersionModalOpen = isOpen;
    if (isOpen) {
      this._gameEditorService.getContentVersionsForGame();
    }
  }
}
