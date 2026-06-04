import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import {
  ActionEffect,
  QuestActor,
  QuestArea,
  SelectUIOption,
} from '@app/features/main/interfaces/types';
import {
  additionalItemOptions,
  inventoryDefinitions,
} from '@content/item-definitions';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getPositionKeysForGridSize } from '@app/features/main/utils';
import { floorDefinitions } from '@content/floor-definitions';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import {
  ActorInteractionType,
  ActorType,
} from '@app/features/main/interfaces/enums';
import { actorDefinitions, actorTypeOptions } from '@content/actor-definitions';
import { EditorInputActionsComponent } from '../editor-input-actions/editor-input-actions.component';
import { itemOptions } from '@content/item-definitions';

@Component({
  selector: 'app-editor-panel-actors',
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    IconButtonComponent,
    AreaCellSelectorComponent,
    EditorInputActionsComponent,
  ],
  templateUrl: './editor-panel-actors.component.html',
  styleUrl: './editor-panel-actors.component.css',
})
export class EditorPanelActorsComponent {
  constructor(private _gameEditorService: GameEditorService) {}

  private subscriptions: Subscription[] = [];
  public actorTypeOptions: SelectUIOption[] = actorTypeOptions;
  public lockouts: string[] = [];
  public area: QuestArea | null = null;
  public selectedAreaId: string = '';
  public selectedActorId: string = '';
  public actors: QuestActor[] = [];
  public inputActorName: string = '';
  public inputActorPosition: string = '';
  public inputActorType: ActorType = ActorType.SLIME_GREEN;
  public selectedActorInteractionType: ActorInteractionType =
    ActorInteractionType.HOSTILE;
  public inputActions: ActionEffect[] = [];
  public actorDropItemOptions: SelectUIOption[] = [
    { label: 'None', value: '' },
    ...itemOptions,
  ];
  public inputActorDropItem: string = '';
  public inventoryItemOptions: SelectUIOption[] = [];
  public inputActorInventory: string[] = [];
  public inventoryDefinitions = inventoryDefinitions;

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
    this.actors = this._gameEditorService.getActorsForCurrentArea();
    this.inventoryItemOptions = additionalItemOptions;
    const actor = this.getSelectedActor();
    const actorDef = actorDefinitions[actor?.actorType || ''];
    if (actorDef) {
      this.selectedActorInteractionType = actorDef.interactionType;
    }
    this.updateActorPositionLockouts();
  }

  public updateUiAfterActorSelection(id: string) {
    const selectedActor = this.actors.find(actor => actor.id === id);
    let shopInventory: string[] = [];
    if (selectedActor?.shopInventory) {
      shopInventory = selectedActor.shopInventory.map(i => i.inventoryItemId);
    }
    this.inputActorPosition = selectedActor
      ? `${selectedActor.y}_${selectedActor.x}`
      : '';
    this.inputActorType = selectedActor ? selectedActor.actorType : '';
    this.inputActorName = selectedActor ? selectedActor.name || '' : '';
    this.inputActions = selectedActor ? selectedActor.actions || [] : [];
    this.inputActorDropItem = selectedActor ? selectedActor.dropItem || '' : '';
    this.inputActorInventory = shopInventory;
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

  private getSelectedActor(): QuestActor | null {
    return this.actors.find(actor => actor.id === this.selectedActorId) || null;
  }

  public handleActorInputChange() {
    const selectedActor = this.getSelectedActor();
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
        actions: this.inputActions,
        dropItem: this.inputActorDropItem,
        shopInventory: this.inputActorInventory.map(item => ({
          inventoryItemId: item,
        })),
      };

      this._gameEditorService.updateActor(updatedActor);
      this.refreshUIData();
    }
  }
  public handleActorActionInputChange(actions: ActionEffect[]) {
    this.inputActions = actions;
    this.handleActorInputChange();
  }

  public handleActorInventoryChange(item: string) {
    if (this.inputActorInventory.includes(item)) {
      this.inputActorInventory = this.inputActorInventory.filter(
        i => i !== item
      );
    } else {
      this.inputActorInventory = [...this.inputActorInventory, item];
    }
    this.handleActorInputChange();
  }

  public handlePositionSelect(position: string) {
    this.inputActorPosition = position;
    this.handleActorInputChange();
  }
}
