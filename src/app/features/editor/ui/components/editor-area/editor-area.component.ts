import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { AreaCellComponent } from '@app/features/game/ui/components/area-cell/area-cell.component';
import { AreaCellButtonComponent } from '@app/features/editor/ui/components/area-cell-button/area-cell-button.component';
import {
  Game,
  GameArea,
  GameAreaExit,
  GameAreaMapCell,
  GameItem,
} from '@app/features/main/interfaces/types';
import { AreaExitComponent } from '@app/features/game/ui/components/area-exit/area-exit.component';
import { AreaItemComponent } from '@app/features/game/ui/components/area-item/area-item.component';

@Component({
  selector: 'app-editor-area',
  standalone: true,
  imports: [
    AreaCellComponent,
    AreaCellButtonComponent,
    AreaExitComponent,
    AreaItemComponent,
  ],
  templateUrl: './editor-area.component.html',
  styleUrl: './editor-area.component.css',
})
export class EditorAreaComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];

  game: Game | null = null;
  selectedAreaId: string = '';
  selectedArea: GameArea | null = null;
  selectedAreaMap: GameArea['map'] | null = null;
  selectedAreaExits: GameArea['exits'] | null = null;
  selectedAreaItems: GameArea['items'] | null = null;
  selectedAreaCellPosition: string = '';
  selectedCell: GameAreaMapCell | null = null;
  anyCellSelected: boolean = false;
  areaDataPositionKeys: string[] = [];

  getAreaData() {
    this.selectedAreaMap = this.selectedArea?.map ?? null;
    this.areaDataPositionKeys = this.selectedArea?.map
      ? Object.keys(this.selectedArea.map)
      : [];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: Game | null) => {
        this.game = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellObs.subscribe(
        (data: GameAreaMapCell | null) => {
          this.anyCellSelected = data !== null;
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellPositionObs.subscribe(
        (data: string) => {
          this.selectedAreaCellPosition = data;
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: string) => {
        this.selectedAreaId = data;
        this.selectedArea =
          this.game?.content.areas[this.selectedAreaId] ?? null;
        this.getAreaData();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.areaExitsObs.subscribe((data: GameAreaExit[]) => {
        this.selectedAreaExits = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.areaItemsObs.subscribe((data: GameItem[]) => {
        this.selectedAreaItems = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaObs.subscribe(
        (data: GameArea | null) => {
          if (data) {
            this.selectedArea = data;
            this.getAreaData();
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleAreaCellClick(areaId: string, cellPosition: string) {
    this.selectedAreaCellPosition = cellPosition;
    this.selectedCell = this.selectedArea?.map[cellPosition] ?? null;
  }

  clearCellSelection() {
    this.selectedAreaCellPosition = '';
    this.selectedCell = null;
    this._gameEditorService.setSelectedCellPosition('');
  }

  handleBackgroundClick() {
    this.clearCellSelection();
  }
}
