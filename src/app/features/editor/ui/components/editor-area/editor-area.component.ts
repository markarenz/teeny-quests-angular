import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import {
  QuestROM,
  QuestArea,
  QuestAreaExit,
  QuestAreaMapCell,
  QuestItem,
  QuestProp,
  QuestActor,
} from '@app/features/main/interfaces/types';
import { AreaCellComponent } from '@app/features/game/ui/components/area-cell/area-cell.component';
import { AreaExitComponent } from '@app/features/game/ui/components/area-exit/area-exit.component';
import { AreaItemComponent } from '@app/features/game/ui/components/area-item/area-item.component';
import { AreaPropComponent } from '@app/features/game/ui/components/area-prop/area-prop.component';
import { AreaActorComponent } from '@app/features/game/ui/components/area-actor/area-actor.component';
import { EditorPlayerPositionComponent } from '../editor-player-position/editor-player-position.component';

@Component({
  selector: 'app-editor-area',
  imports: [
    AreaCellComponent,
    AreaExitComponent,
    AreaItemComponent,
    AreaPropComponent,
    AreaActorComponent,
    EditorPlayerPositionComponent,
  ],
  templateUrl: './editor-area.component.html',
  styleUrl: './editor-area.component.css',
  standalone: true,
})
export class EditorAreaComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  @Output() onSelectItem = new EventEmitter<string>();
  @Output() onSelectProp = new EventEmitter<string>();
  @Output() onSelectExit = new EventEmitter<string>();
  @Output() onSelectMapCell = new EventEmitter<string>();
  @Output() onSelectActor = new EventEmitter<string>();

  game: QuestROM | null = null;
  selectedAreaId: string = '';
  selectedArea: QuestArea | null = null;
  selectedAreaMap: QuestArea['map'] | null = null;
  selectedAreaExits: QuestArea['exits'] | null = null;
  selectedAreaItems: QuestArea['items'] | null = null;
  selectedAreaProps: QuestArea['props'] | null = null;
  selectedAreaActors: QuestArea['actors'] | null = null;
  selectedAreaCellPositions: string[] = [];
  selectedItemId: string = '';
  selectedExitId: string = '';
  selectedPropId: string = '';
  selectedActorId: string = '';
  selectedExitDestination: string = '';
  selectedCell: QuestAreaMapCell | null = null;
  secondarySelectedCellPosition: string = '';
  anyCellSelected: boolean = false;
  areaDataPositionKeys: string[] = [];
  playerPosition: string = '';
  public playerPositionForActors = '-1_-1';

  updatePlayerPosition() {
    let nextPlayerPosition = '';
    if (this.selectedAreaId === this.game?.content.player.areaId) {
      const { x, y } = this.game.content.player;
      nextPlayerPosition = `${y}_${x}`;
    }
    this.playerPosition = nextPlayerPosition;
    this.playerPositionForActors =
      this.game?.content.player.areaId === this.selectedAreaId
        ? this.playerPosition
        : '-1_-1';
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
      this._gameEditorService.gameObs.subscribe((data: QuestROM | null) => {
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
      this._gameEditorService.selectedPropIdObs.subscribe((data: string) => {
        this.selectedPropId = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellObs.subscribe(
        (data: QuestAreaMapCell | null) => {
          this.anyCellSelected = data !== null;
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.selectedCellPositionsObs.subscribe(
        (data: string[]) => {
          this.selectedAreaCellPositions = data;
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.secondarySelectedCellPositionObs.subscribe(
        (data: string) => {
          this.secondarySelectedCellPosition = data;
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
      this._gameEditorService.areaExitsObs.subscribe(
        (data: QuestAreaExit[]) => {
          this.selectedAreaExits = data;
        }
      )
    );
    this.subscriptions.push(
      this._gameEditorService.areaPropsObs.subscribe((data: QuestProp[]) => {
        this.selectedAreaProps = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.areaItemsObs.subscribe((data: QuestItem[]) => {
        this.selectedAreaItems = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.areaActorsObs.subscribe((data: QuestActor[]) => {
        this.selectedAreaActors = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaObs.subscribe(
        (data: QuestArea | null) => {
          if (data) {
            this.selectedArea = data;
            this.getAreaData();
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleAreaCellClick(_areaId: string, cellPosition: string) {
    this.selectedAreaCellPositions = [cellPosition];
    this.selectedCell = this.selectedArea?.map[cellPosition] ?? null;
    this._gameEditorService.setSelectedCellPositions(cellPosition);
  }

  clearCellSelection() {
    this.selectedAreaCellPositions = [];
    this.selectedCell = null;
    this._gameEditorService.setSelectedCellPositions(null);
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
  handlePropClick(id: string) {
    this.onSelectProp.emit(id);
  }
  handleMapCellClick(id: string) {
    this.onSelectMapCell.emit(id);
  }
  handleActorClick(id: string) {
    this.onSelectActor.emit(id);
  }
}
