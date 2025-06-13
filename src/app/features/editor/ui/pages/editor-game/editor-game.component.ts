import { Component } from '@angular/core';
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
import { gamesApiUrl } from '@config/index';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { EditorAreaComponent } from '../../components/editor-area/editor-area.component';
import { EditorAreaSelectorComponent } from '../../components/editor-area-selector/editor-area-selector.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

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
  ],
  templateUrl: './editor-game.component.html',
  styleUrl: './editor-game.component.css',
})
export class EditorGameComponent {
  constructor(
    private _route: ActivatedRoute,
    private _gameEditorService: GameEditorService
  ) {}
  private subscriptions: Subscription[] = [];

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

  handleSaveClick() {
    this.isLoading = true;
    console.log('Saving game:', this.game?.content.areas['start'].exits);
    fetch(gamesApiUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({
        ...this.game,
        content: this.game ? JSON.stringify(this.game.content ?? {}) : '{}',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.isLoading = false;
      });
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
}
