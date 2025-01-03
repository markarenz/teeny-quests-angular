import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Game,
  GameArea,
  Link,
  SubNavItem,
} from '@app/features/main/interfaces/types';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@app/features/main/ui/components/container/container.component';
import { EditorPanelExitsComponent } from '../../components/editor-panel-exits/editor-panel-exits.component';
import { gamesApiUrl } from '@config/index';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { EditorAreaComponent } from '../../components/editor-area/editor-area.component';
import { EditorAreaSelectorComponent } from '../../components/editor-area-selector/editor-area-selector.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorPanelCellsComponent } from '../../components/editor-panel-cells/editor-panel-cells.component';

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
    EditorPanelExitsComponent,
    EditorPanelCellsComponent,
  ],
  templateUrl: './editor-game.component.html',
  styleUrl: './editor-game.component.css',
})
export class EditorGameComponent {
  constructor(
    private _route: ActivatedRoute,
    private _gameEditorService: GameEditorServiceService
  ) {}
  private subscriptions: Subscription[] = [];

  title = 'Editor Game';
  isLoading: boolean = false;
  isDirty: boolean = false;
  isValid: boolean = false;
  game: Game | null = null;

  // TODO: Add type for area and areaCell
  // Door floor height is based on the adjacent area's floor height in the direction of the door

  breadcrumbLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Game Editor', href: '/editor' },
    { label: 'Editing Game' },
  ];

  subNavCurrent: string = 'areas';
  subNavLinks: SubNavItem[] = [
    { label: 'Info', slug: 'info' },
    { label: 'Areas', slug: 'areas' },
    { label: 'Misc', slug: 'misc' },
  ];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: Game | null) => {
        if (this.game) {
          this.isDirty = true;
          this.validateForm();
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

  validateForm() {
    if (!this.game) {
      this.isValid = false;
    } else {
      let validCheck = true;
      if (this.game.title.length < 1 || this.game.description.length < 1) {
        validCheck = false;
      }
      this.isValid = validCheck;
    }
  }

  handleSaveClick() {
    this.isLoading = true;
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
    this.subNavCurrent = slug;
  }
}
