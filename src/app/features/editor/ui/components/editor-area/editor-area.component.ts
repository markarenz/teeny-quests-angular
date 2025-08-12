import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import {
  GameROM,
  GameArea,
  GameAreaExit,
  GameAreaMapCell,
  GameItem,
} from '@app/features/main/interfaces/types';
import { AreaCellComponent } from '@app/features/game/ui/components/area-cell/area-cell.component';
import { AreaExitComponent } from '@app/features/game/ui/components/area-exit/area-exit.component';
import { AreaItemComponent } from '@app/features/game/ui/components/area-item/area-item.component';
import { EditorPlayerPositionComponent } from '../editor-player-position/editor-player-position.component';

@Component({
  selector: 'app-editor-area',
  standalone: true,
  imports: [
    AreaCellComponent,
    AreaExitComponent,
    AreaItemComponent,
    EditorPlayerPositionComponent,
  ],
  templateUrl: './editor-area.component.html',
  styleUrl: './editor-area.component.css',
})
export class EditorAreaComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  @Output() onSelectItem = new EventEmitter<string>();
  @Output() onSelectExit = new EventEmitter<string>();
  @Output() onSelectMapCell = new EventEmitter<string>();

  game: GameROM | null = null;
  selectedAreaId: string = '';
  selectedArea: GameArea | null = null;
  selectedAreaMap: GameArea['map'] | null = null;
  selectedAreaExits: GameArea['exits'] | null = null;
  selectedAreaItems: GameArea['items'] | null = null;
  selectedAreaCellPosition: string = '';
  selectedItemId: string = '';
  selectedExitId: string = '';
  selectedExitDestination: string = '';
  selectedCell: GameAreaMapCell | null = null;
  anyCellSelected: boolean = false;
  areaDataPositionKeys: string[] = [];
  playerPosition: string = '';

  updatePlayerPosition() {
    let nextPlayerPosition = '';
    if (this.selectedAreaId === this.game?.content.player.areaId) {
      const { x, y } = this.game.content.player;
      nextPlayerPosition = `${y}_${x}`;
    }
    this.playerPosition = nextPlayerPosition;
  }

  getAreaData() {
    this.selectedAreaMap = this.selectedArea?.map ?? null;
    this.areaDataPositionKeys = this.selectedArea?.map
      ? Object.keys(this.selectedArea.map)
      : [];
    this.updatePlayerPosition();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        this.game = data;
        this.updatePlayerPosition();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedItemIdObs.subscribe((data: string) => {
        this.selectedItemId = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedExitIdObs.subscribe((data: string) => {
        this.selectedExitId = data;
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
  handleExitClick(id: string) {
    this.onSelectExit.emit(id);
  }
  handleItemClick(id: string) {
    this.onSelectItem.emit(id);
  }
  handleMapCellClick(id: string) {
    console.log('Map cell clicked:', id);
    this.onSelectMapCell.emit(id);
  }
}
