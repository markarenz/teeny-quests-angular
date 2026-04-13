import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  QuestROM,
  Link,
  SubNavItem,
} from '@app/features/main/interfaces/types';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@app/features/main/ui/components/container/container.component';
import { EditorPanelInfoComponent } from '../../components/editor-panel-info/editor-panel-info.component';
import { EditorPanelCellsComponent } from '../../components/editor-panel-cells/editor-panel-cells.component';
import { EditorPanelPropsComponent } from '../../components/editor-panel-props/editor-panel-props.component';
import { EditorPanelExitsComponent } from '../../components/editor-panel-exits/editor-panel-exits.component';
import { EditorPanelItemsComponent } from '../../components/editor-panel-items/editor-panel-items.component';
import { EditorPanelEventsComponent } from '../../components/editor-panel-events/editor-panel-events.component';
import { EditorPanelActorsComponent } from '../../components/editor-panel-actors/editor-panel-actors.component';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { EditorAreaComponent } from '../../components/editor-area/editor-area.component';
import { EditorAreaSelectorComponent } from '../../components/editor-area-selector/editor-area-selector.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { ContentVersionsModalComponent } from '../../components/content-versions-modal/content-versions-modal.component';
import { CommonModalComponent } from '@app/features/main/ui/components/common-modal/common-modal.component';
import { ActivityType } from '@app/features/main/interfaces/enums';
import { tqConfig } from '@content/constants';

@Component({
  selector: 'app-editor-game',
  imports: [
    ContainerComponent,
    MainLayoutComponent,
    CommonModalComponent,
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
    EditorPanelPropsComponent,
    EditorPanelEventsComponent,
    EditorPanelActorsComponent,
    ContentVersionsModalComponent,
  ],
  templateUrl: './editor-game.component.html',
  styleUrl: './editor-game.component.css',
  standalone: true,
})
export class EditorGameComponent {
  private subscriptions: Subscription[] = [];
  public isContentVersionModalOpen: boolean = false;
  public subNavCurrent: string = 'info';
  public showAreaSelector: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _gameEditorService: GameEditorService,
    private _authGoogleService: AuthProviderService,
    private router: Router,
    private _gameService: GameService
  ) {}

  public title = '';
  public isLoading: boolean = false;
  public isValid: boolean = false;
  public game: QuestROM | null = null;
  public hasSaveError: boolean = false;

  breadcrumbLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Quest Editor', href: '/editor' },
    { label: 'Editing Quest' },
  ];

  subNavLinks: SubNavItem[] = [
    { label: 'Info', slug: 'info' },
    { label: 'Map', slug: 'map' },
    { label: 'Exits', slug: 'exits' },
    { label: 'Items', slug: 'items' },
    { label: 'Props', slug: 'props' },
    { label: 'Actors', slug: 'actors' },
    { label: 'Events', slug: 'events' },
  ];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: QuestROM | null) => {
        const userId = this._authGoogleService.getUserId();
        if (data && data.userId !== userId && !tqConfig.testMode) {
          this.router.navigate(['/']);
          return;
        }
        this.game = data;
        if (this.game?.title) {
          this.title = this.game?.title;
        }
      })
    );

    const id = this._route.snapshot.paramMap.get('id');
    this._gameEditorService.getGameById(id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public loadGameFromLocalStorage() {
    if (this.game?.id) {
      this._gameEditorService.loadFromLocalStorage(this.game.id);
    }
  }

  async handleSaveClick() {
    this.isLoading = true;
    const response = await this._gameEditorService.saveGame(this.game!);
    // Register update event, which will also update play and completion counts
    this._gameService.registerActivity(
      this.game?.id ?? '',
      ActivityType.UPDATE
    );

    if (response !== 'success') {
      this.hasSaveError = true;
    }
    this.isLoading = false;
  }
  handleErrorModalDismiss() {
    this.hasSaveError = false;
  }

  private setShowAreaSelector() {
    this.showAreaSelector = [
      'map',
      'props',
      'exits',
      'items',
      'actors',
    ].includes(this.subNavCurrent);
  }
  handleSubNavClick(slug: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem('');
    this.subNavCurrent = slug;
    this.setShowAreaSelector();
  }

  handleSelectItem(id: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem(id);
    this.subNavCurrent = 'items';
    this.setShowAreaSelector();
  }

  handleSelectExit(id: string) {
    this._gameEditorService.selectItem('');
    this._gameEditorService.selectExit(id);
    this._gameEditorService.selectProp('');
    this.subNavCurrent = 'exits';
    this.setShowAreaSelector();
  }

  handleSelectPanel(id: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem('');
    this._gameEditorService.selectProp(id);
    this.subNavCurrent = 'props';
  }
  handleSelectMapCell(id: string) {
    this._gameEditorService.selectExit('');
    this._gameEditorService.selectItem('');
    this._gameEditorService.selectProp('');
    this._gameEditorService.setSelectedCellPositions(id);
    this.subNavCurrent = 'map';
    this.setShowAreaSelector();
  }
  handlePlayClick() {
    this.router.navigate([`/quest/${this.game?.id ?? ''}`]);
  }

  public handleContentVersionModalToggle(isOpen: boolean) {
    this.isContentVersionModalOpen = isOpen;
    if (isOpen) {
      this._gameEditorService.getContentVersionsForGame();
    }
  }
}
