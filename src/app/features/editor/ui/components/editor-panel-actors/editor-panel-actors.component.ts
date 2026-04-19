import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import {
  QuestActor,
  QuestArea,
  SelectIUIOption,
} from '@app/features/main/interfaces/types';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getPositionKeysForGridSize } from '@app/features/main/utils';
import { floorDefinitions } from '@content/floor-definitions';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { ActorType } from '@app/features/main/interfaces/enums';
import { actorTypeOptions } from '@content/actor-definitions';

@Component({
  selector: 'app-editor-panel-actors',
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    IconButtonComponent,
    AreaCellSelectorComponent,
  ],
  templateUrl: './editor-panel-actors.component.html',
  styleUrl: './editor-panel-actors.component.css',
})
export class EditorPanelActorsComponent {
  constructor(private _gameEditorService: GameEditorService) {}

  private subscriptions: Subscription[] = [];
  public actorTypeOptions: SelectIUIOption[] = actorTypeOptions;
  public lockouts: string[] = [];
  public area: QuestArea | null = null;
  public selectedAreaId: string = '';
  public selectedActorId: string = '';
  public actors: QuestActor[] = [];
  public inputActorName: string = '';
  public inputActorPosition: string = '';
  public inputActorType: ActorType = ActorType.SLIME_GREEN;

  ngOnInit() {
    this.handleAreaChange(this._gameEditorService.getSelectedAreaId());
    this.subscriptions.push(
      this._gameEditorService.selectedActorIdObs.subscribe((data: string) => {
        this.selectedActorId = data;
        this.actors = this._gameEditorService.getActorsForCurrentArea();
        this.updateUiAfterActorSelection(data);
        this.updateActorPositionLockouts();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        this.handleAreaChange(data);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public refreshUIData() {
    this.updateActorPositionLockouts();
  }

  public updateUiAfterActorSelection(id: string) {
    const selectedActor = this.actors.find(actor => actor.id === id);
    this.inputActorPosition = selectedActor
      ? `${selectedActor.y}_${selectedActor.x}`
      : '';
    this.inputActorType = selectedActor ? selectedActor.actorType : '';
    this.inputActorName = selectedActor ? selectedActor.name || '' : '';
    this.updateActorPositionLockouts();
    this.refreshUIData();
  }

  private handleAreaChange(newAreaId: string) {
    if (this.selectedAreaId !== newAreaId) {
      this.selectedAreaId = newAreaId;
      this.actors = this._gameEditorService.getActorsForCurrentArea();
      this.area = this._gameEditorService.getAreaById(this.selectedAreaId);
      if (this.area && !this.area?.actors) {
        this.area.actors = [];
      }
      this.refreshUIData();
    }
  }

  public updateActorPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      const selectedActor = this.actors.find(
        actor => actor.id === this.selectedActorId
      );

      this.area.items.forEach(item => {
        newLockouts.push(`${item.y}_${item.x}`);
      });
      this.actors.forEach((actor: QuestActor) => {
        if (actor.id !== this.selectedActorId) {
          newLockouts.push(`${actor.y}_${actor.x}`);
        }
      });
      const positionKeys = getPositionKeysForGridSize();
      const map = this.area.map;
      positionKeys.forEach((position: string) => {
        const floor = floorDefinitions[map[position].floor];
        if (
          (map[position].isHidden ||
            !floor.walkable ||
            map[position].h === 0) &&
          !newLockouts.includes(position)
        ) {
          newLockouts.push(position);
        }
      });
      this.lockouts = newLockouts;
    }
  }

  public handleCreateClick() {
    const actor: QuestActor | null = this._gameEditorService.createActor(
      this.lockouts
    );
    this.refreshUIData();
    if (actor) {
      this.handleEditClick(actor.id);
    }
  }

  public handleDeleteClick(id: string) {
    this._gameEditorService.deleteActor(id);
    this.actors = this._gameEditorService.getActorsForCurrentArea();
    this._gameEditorService.selectActor('');
    this.refreshUIData();
  }

  public handleEditClick(id: string) {
    if (this.selectedActorId === id) {
      this._gameEditorService.selectActor('');
      this.selectedActorId = '';
      return;
    }
    this._gameEditorService.selectActor(id);
  }

  public handleActorInputChange() {
    const selectedActor = this.actors.find(
      actor => actor.id === this.selectedActorId
    );
    const [y, x] = this.inputActorPosition.split('_');
    if (selectedActor) {
      const updatedActor: QuestActor = {
        ...selectedActor,
        id: this.selectedActorId,
        name: this.inputActorName,
        actorType: this.inputActorType,
        areaId: this.selectedAreaId,
        x: +x,
        y: +y,
        // health
      };

      this._gameEditorService.updateActor(updatedActor);
      this.refreshUIData();
    }
  }

  public handlePositionSelect(position: string) {
    this.inputActorPosition = position;
    this.handleActorInputChange();
  }
}
