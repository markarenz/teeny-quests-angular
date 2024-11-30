import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { AreaCellComponent } from '@app/features/editor/ui/components/area-cell/area-cell.component';
import { AreaCellButtonComponent } from '@app/features/editor/ui/components/area-cell-button/area-cell-button.component';
import { AreaCellModalComponent } from '../area-cell-modal/area-cell-modal.component';
import {
  Game,
  GameArea,
  GameAreaMapCell,
} from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-editor-area',
  standalone: true,
  imports: [AreaCellComponent, AreaCellButtonComponent, AreaCellModalComponent],
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
  selectedAreaCellPosition: string = '';
  selectedCell: GameAreaMapCell | null = null;
  areaDataPositionKeys: string[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: Game | null) => {
        this.game = data;
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: string) => {
        this.selectedAreaId = data;
        this.selectedArea =
          this.game?.content.areas[this.selectedAreaId] ?? null;
        this.selectedAreaMap = this.selectedArea?.map ?? null;
        this.areaDataPositionKeys = this.selectedArea?.map
          ? Object.keys(this.selectedArea.map)
          : [];
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleAreaCellClick(areaId: string, cellPosition: string) {
    this.selectedAreaCellPosition = cellPosition;
    this.selectedCell = this.selectedArea?.map[cellPosition] ?? null;
  }

  handleBackgroundClick() {
    this.selectedAreaCellPosition = '';
    this.selectedCell = null;
    this._gameEditorService.setSelectedCellPosition('');
  }
}
