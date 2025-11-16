import { Component, input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import { GameArea, GameROM } from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { EditorAreaSelectorGeneralComponent } from '../editor-area-selector-general/editor-area-selector-general.component';
import { EditorInventoryComponent } from '../editor-inventory/editor-inventory.component';
import { getPositionKeysForGridSize } from '@app/features/main/utils';
import { floorDefinitions } from '@content/floor-definitions';

@Component({
  selector: 'app-editor-panel-info',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    EditorAreaSelectorGeneralComponent,
    EditorInventoryComponent,
  ],
  templateUrl: './editor-panel-info.component.html',
  styleUrl: './editor-panel-info.component.css',
})
export class EditorPanelInfoComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];

  inputTitle: string = '';
  inputTitleMaxLength: number = 128;
  inputDescription: string = '';
  inputIntroduction = '';
  inputDescriptionMaxLength: number = 512;
  inputIntroductionMaxLength: number = 2048;
  inputItemStatus: string = '';
  inputStartingAreaId: string = '';
  inputStartingAreaPosition: string = '';
  inputStartingAreaPositionX: number = 4;
  inputStartingAreaPositionY: number = 4;
  lockouts: string[] = [];

  game: GameROM | null = null;

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        if (data) {
          this.game = data;
          this.inputTitle = this.game?.title || '';
          this.inputDescription = this.game?.description || '';
          this.inputIntroduction = this.game?.introduction || '';
          this.inputItemStatus = this.game?.itemStatus || '';
          this.inputStartingAreaPosition =
            `${this.game?.content.player.y}_${this.game?.content.player.x}` ||
            '4_4';
          this.inputStartingAreaId = this.game?.content.player.areaId || '';
          const area = this.game.content.areas[this.inputStartingAreaId];
          this.lockouts = this.getLockouts(area);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getLockouts(area: GameArea): string[] {
    const newLockouts: string[] = [];
    area.items.forEach(item => {
      newLockouts.push(`${item.y}_${item.x}`);
    });
    area.exits.forEach(exit => {
      newLockouts.push(`${exit.y}_${exit.x}`);
    });
    area.props.forEach(prop => {
      newLockouts.push(`${prop.y}_${prop.x}`);
    });
    const positionKeys = getPositionKeysForGridSize();
    const map = area.map;
    positionKeys.forEach((position: string) => {
      const floor = floorDefinitions[map[position].floor];
      if (
        (!floor.walkable || map[position].isHidden) &&
        !newLockouts.includes(position)
      ) {
        newLockouts.push(position);
      }
    });
    return newLockouts;
  }

  handleInfoChange() {
    if (this.game) {
      this._gameEditorService.updateGame({
        ...this.game,
        title: this.inputTitle,
        description: this.inputDescription,
        introduction: this.inputIntroduction,
        itemStatus: this.inputItemStatus,
        content: {
          ...this.game.content,
          player: {
            ...this.game.content.player,
            areaId: this.inputStartingAreaId,
            x: this.inputStartingAreaPositionX,
            y: this.inputStartingAreaPositionY,
          },
        },
      });
    }
  }

  handleStartingAreaChange(newAreaId: string) {
    this.inputStartingAreaId = newAreaId;
    this.handleInfoChange();
  }
  handlePlayerStartPositionChange(newPosition: string) {
    const [y, x] = newPosition.split('_');
    console.log('strartibng position change:', y, x);
    this.inputStartingAreaPositionX = +x;
    this.inputStartingAreaPositionY = +y;
    this.handleInfoChange();
  }

  onChangeNoLineBreaks(event: any) {
    this.inputDescription = this.inputDescription.replaceAll('*', '!');
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }
}
