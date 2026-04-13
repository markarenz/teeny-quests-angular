import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { QuestActor, QuestArea } from '@app/features/main/interfaces/types';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getPositionKeysForGridSize } from '@app/features/main/utils';
import { floorDefinitions } from '@content/floor-definitions';

@Component({
  selector: 'app-editor-panel-actors',
  imports: [CollapsibleCardComponent, IconButtonComponent],
  templateUrl: './editor-panel-actors.component.html',
  styleUrl: './editor-panel-actors.component.css',
})
export class EditorPanelActorsComponent {
  constructor(private _gameEditorService: GameEditorService) {}

  private subscriptions: Subscription[] = [];
  public lockouts: string[] = [];
  public area: QuestArea | null = null;
  public selectedAreaId: string = '';
  public selectedActorId: string = '';
  public actors: QuestActor[] = [];

  ngOnInit() {
    this.handleAreaChange(this._gameEditorService.getSelectedAreaId());
    this.subscriptions.push(
      this._gameEditorService.selectedActorIdObs.subscribe((data: string) => {
        this.selectedActorId = data;
        this.actors = this._gameEditorService.getActorsForCurrentArea();
        this.updateUiAfterActorSelection(data);
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
    // const propOnCell = this.area?.props.find(prop => {
    //   const position = this.inputExitPosition;
    //   const [y, x] = position.split('_');
    //   return prop.x === +x && prop.y === +y;
    // });
    // this.exitDirectionOptions = exitDirections.filter(option => {
    //   // if there is a prop on this square, ignore options that match the wall value
    //   if (propOnCell && propOnCell.wall === option.value) {
    //     return false;
    //   }
    //   return true;
    // });
    // this.exitsListOptions = [
    //   { value: '', label: 'None' },
    //   ...this._gameEditorService
    //     .getDestinationExitsListOptions(this.inputExitDestination)
    //     .filter(item => item.value !== this.selectedExitId),
    // ];
  }

  public updateUiAfterActorSelection(id: string) {
    const selectedActor = this.actors.find(actor => actor.id === id);
    // this.inputActorPosition = selectedActor
    //   ? `${selectedActor.y}_${selectedActor.x}`
    //   : '';
    // this.inputActorDirection = selectedActor ? selectedActor.direction : '';
    // this.inputActorType = selectedActor ? selectedActor.exitType : '';
    // this.inputActorDestination = selectedActor
    //   ? selectedActor.destinationAreaId
    //   : '';
    // this.inputActorDestinationExit = selectedActor
    //   ? selectedActor.destinationExitId
    //   : '';
    // this.inputActorLockType = selectedActor ? selectedActor.lock || '' : '';
    // this.inputActorName = selectedActor ? selectedActor.name || '' : '';
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
      this.area.actors.forEach((actor: QuestActor) => {
        newLockouts.push(`${actor.y}_${actor.x}`);
      });
      const selectedActor = this.actors.find(
        actor => actor.id === this.selectedActorId
      );

      this.area.props.forEach(prop => {
        if (
          this.actors.some(
            actor =>
              selectedActor?.id !== actor.id &&
              actor.x === prop.x &&
              actor.y === prop.y
          )
        ) {
          newLockouts.push(`${prop.y}_${prop.x}`);
        }
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
    this.refreshUIData();
  }

  public handleEditClick(id: string) {
    if (this.selectedActorId === id) {
      this._gameEditorService.selectActor('');
      this.selectedActorId = '';
      return;
    }
    this._gameEditorService.selectActor(id);
    this.updateUiAfterActorSelection(id);
  }
}
