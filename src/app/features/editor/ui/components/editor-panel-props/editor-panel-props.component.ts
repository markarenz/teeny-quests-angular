import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import {
  GameArea,
  GameProp,
  SelectIUIOption,
  GameActionEffects,
  ActionEffect,
  PropDefinition,
} from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getLabelFromSlug, getPositionKeysForGridSize } from '@main/utils';
import { floorDefinitions } from '@content/floor-definitions';
import { EditorInputActionsComponent } from '../editor-input-actions/editor-input-actions.component';
import {
  propDecoDefinitions,
  propDecoOptions,
  propDecoWallOptions,
} from '@content/prop-definitions';

@Component({
  selector: 'app-editor-panel-props',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
    EditorInputActionsComponent,
  ],
  templateUrl: './editor-panel-props.component.html',
  styleUrl: './editor-panel-props.component.css',
})
export class EditorPanelPropsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  selectedAreaId: string = '';
  propTypeOptions: SelectIUIOption[] = propDecoOptions;

  selectedPropDefinition: PropDefinition | null = null;
  selectedPropActions: GameActionEffects = {};
  inputPropType: string = '';
  inputPropPosition: string = '1_1';
  inputPropWall: string = 'west';
  inputPropHeight = '1';
  inputPropStatus: string = '';
  inputPropStatusEffects: GameActionEffects = {};

  canSetHeight: boolean = true;
  selectedPropId: string = '';
  props: GameProp[] = [];
  isSelectedPositionValid: boolean = false;

  lockouts: string[] = [];
  area: GameArea | null = null;
  propWallOptions = propDecoWallOptions;
  propStatusOptions: SelectIUIOption[] = [];
  propHeightOptions: SelectIUIOption[] = [];

  getNeighbors(position: string): { neighborN: any; neighborW: any } {
    if (!this.area) return { neighborN: null, neighborW: null };
    const map = this.area.map;
    const [y, x] = position.split('_').map(Number);
    const neighborN = map[`${y - 1}_${x}`] || null;
    const neighborW = map[`${y}_${x - 1}`] || null;
    return { neighborN, neighborW };
  }

  refreshUIData() {
    if (this.selectedPropId) {
      if (!this.area) return;
      const position =
        this.inputPropPosition.length > 0 ? this.inputPropPosition : '1_1';
      const map = this.area.map;
      const currentH = map[position].h;
      this.selectedPropDefinition =
        propDecoDefinitions[this.inputPropType] ?? null;
      if (!this.selectedPropDefinition) {
        console.error('ERROR: Prop has no definition', this.inputPropType);
        return;
      }
      this.canSetHeight = this.selectedPropDefinition.canSetHeight;
      if (!this.canSetHeight) {
        this.inputPropHeight = currentH.toString();
      }

      this.propStatusOptions = this.selectedPropDefinition?.statuses
        ? this.selectedPropDefinition?.statuses.map(status => {
            return { value: status, label: getLabelFromSlug(status) };
          })
        : [];

      const selectedProp = this.props.find(
        prop => prop.id === this.selectedPropId
      );
      const { neighborN, neighborW } = this.getNeighbors(position);
      const neighborWValid = neighborW && neighborW.h > currentH + 3;
      const neighborNValid = neighborN && neighborN.h > currentH + 3;
      this.propWallOptions = propDecoWallOptions.filter(option => {
        if (option.value === 'west' && !neighborWValid) {
          return false;
        }
        if (option.value === 'north' && !neighborNValid) {
          return false;
        }
        return true;
      });
      this.propHeightOptions = [];
      const relevantNeighborHeight =
        this.inputPropWall === 'north' ? neighborN?.h : neighborW?.h;
      const minH = currentH;
      const maxH = relevantNeighborHeight ? relevantNeighborHeight : currentH;
      const diffH = maxH - minH - 4;
      if (diffH >= 0) {
        for (let i = 0; i <= diffH; i++) {
          const stringValue = `${minH + i}`;
          this.propHeightOptions.push({
            value: stringValue,
            label: stringValue,
          });
        }
      }
    }
  }

  updatePropPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      const positionKeys = getPositionKeysForGridSize();
      const map = this.area.map;
      positionKeys.forEach((position: string) => {
        const floor = floorDefinitions[map[position].floor];
        const currentH = map[position].h;
        // check n and w neighbors to see if H is +2 higher than current cell
        const { neighborN, neighborW } = this.getNeighbors(position);

        // If current cell is not walkabout or no 2 unit wall exists to the north or west, lock out this cell
        const neighborWValid = neighborW && neighborW.h > currentH + 3;
        const neighborNValid = neighborN && neighborN.h > currentH + 3;
        if (
          !neighborWValid &&
          !neighborNValid &&
          !newLockouts.includes(position)
        ) {
          newLockouts.push(position);
        }
      });

      this.lockouts = newLockouts;
    }
  }

  ngOnInit() {
    this.updatePropPositionLockouts();
    this.subscriptions.push(
      this._gameEditorService.selectedPropIdObs.subscribe((data: string) => {
        this.props = this._gameEditorService.getPropsForCurrentArea();
        if (data && data.length > 0) {
          this.selectedPropId = data;
          this.updateUiAfterPropSelection(data);
          const selectedProp = this.props.find(
            prop => prop.id === this.selectedPropId
          );
          if (selectedProp) {
            this.selectedPropActions = selectedProp.statusActions || {};
          }
        }
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        if (this.selectedAreaId !== data) {
          this.selectedAreaId = data;
          this.props = this._gameEditorService.getPropsForCurrentArea();
          this.area = this._gameEditorService.getAreaById(this.selectedAreaId);

          this.updatePropPositionLockouts();
          this.refreshUIData();
        }
      })
    );
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: any) => {
        this.refreshUIData();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleDeleteClick(id: string) {
    this._gameEditorService.deleteProp(id);
  }

  updateUiAfterPropSelection(id: string) {
    const selectedProp = this.props.find(prop => prop.id === id);
    this.inputPropPosition = selectedProp
      ? `${selectedProp.y}_${selectedProp.x}`
      : '';
    this.inputPropType = selectedProp ? selectedProp.propType : '';

    this.inputPropWall = selectedProp ? selectedProp.wall : 'north';
    this.inputPropHeight = selectedProp ? `${selectedProp.h}` : '1';
    this.inputPropStatus = selectedProp ? `${selectedProp.status}` : '';
    this.updatePropPositionLockouts();
    this.refreshUIData();
  }

  handleEditClick(id: string) {
    if (this.selectedPropId === id) {
      this._gameEditorService.selectProp('');
      this.selectedPropId = '';
      return;
    }
    this._gameEditorService.selectProp(id);
    this.updateUiAfterPropSelection(id);
  }

  handlePositionSelect(position: string) {
    this.inputPropPosition = position;
    this.handlePropInputChange();
  }

  handleCreateClick() {
    const prop: GameProp | null = this._gameEditorService.createProp(
      this.lockouts
    );
    if (prop) {
      this.handleEditClick(prop.id);
    }
  }

  handlePropInputChange() {
    this.refreshUIData();
    const selectedProp = this.props.find(
      prop => prop.id === this.selectedPropId
    );
    const [y, x] = this.inputPropPosition.split('_');

    if (selectedProp) {
      const wall = this.propWallOptions
        .map(option => option.value)
        .includes(this.inputPropWall)
        ? this.inputPropWall
        : this.propWallOptions[0].value;

      this.inputPropWall = wall;

      const updatedProp: GameProp = {
        ...selectedProp,
        id: this.selectedPropId,
        propType: this.inputPropType,
        areaId: this.selectedAreaId,
        wall,
        x: +x,
        y: +y,
        h: parseInt(this.inputPropHeight, 10),
        status: this.inputPropStatus,
        statusActions: this.selectedPropActions,
      };
      this._gameEditorService.updateProp(updatedProp);

      this.refreshUIData();
    }
  }

  handlePropActionInputChange(actions: ActionEffect[], status: string) {
    this.selectedPropActions[status] = actions;
    this.handlePropInputChange();
  }
}
