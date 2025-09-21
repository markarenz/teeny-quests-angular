import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { FormsModule } from '@angular/forms';
import {
  GameArea,
  GamePanelDeco,
  SelectIUIOption,
  GameActionEffects,
  ActionEffect,
  PanelDecoDefinition,
} from '@app/features/main/interfaces/types';
import { AreaCellSelectorComponent } from '../area-cell-selector/area-cell-selector.component';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { getLabelFromSlug, getPositionKeysForGridSize } from '@main/utils';
import { floorDefinitions } from '@content/floor-definitions';
import { EditorInputActionsComponent } from '../editor-input-actions/editor-input-actions.component';
import {
  panelDecoDefinitions,
  panelDecoOptions,
  panelDecoWallOptions,
} from '@content/panelDeco-definitions';

@Component({
  selector: 'app-editor-panel-paneldeco',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    AreaCellSelectorComponent,
    IconButtonComponent,
    EditorInputActionsComponent,
  ],
  templateUrl: './editor-panel-paneldeco.component.html',
  styleUrl: './editor-panel-paneldeco.component.css',
})
export class EditorPanelPanelDecoComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  selectedAreaId: string = '';
  panelTypeOptions: SelectIUIOption[] = panelDecoOptions;

  selectedPanelDefinition: PanelDecoDefinition | null = null;
  selectedPanelActions: GameActionEffects = {};
  inputPanelType: string = '';
  inputPanelPosition: string = '1_1';
  inputPanelWall: string = 'west';
  inputPanelHeight = '1';
  inputPanelStatus: string = '';
  inputPanelStatusEffects: GameActionEffects = {};

  canSetHeight: boolean = true;
  selectedPanelId: string = '';
  panels: GamePanelDeco[] = [];
  isSelectedPositionValid: boolean = false;

  lockouts: string[] = [];
  area: GameArea | null = null;
  panelWallOptions = panelDecoWallOptions;
  panelStatusOptions: SelectIUIOption[] = [];
  panelHeightOptions: SelectIUIOption[] = [];

  getNeighbors(position: string): { neighborN: any; neighborW: any } {
    if (!this.area) return { neighborN: null, neighborW: null };
    const map = this.area.map;
    const [y, x] = position.split('_').map(Number);
    const neighborN = map[`${y - 1}_${x}`] || null;
    const neighborW = map[`${y}_${x - 1}`] || null;
    return { neighborN, neighborW };
  }

  refreshUIData() {
    if (this.selectedPanelId) {
      if (!this.area) return;
      const position =
        this.inputPanelPosition.length > 0 ? this.inputPanelPosition : '1_1';
      const map = this.area.map;
      const currentH = map[position].h;
      this.selectedPanelDefinition =
        panelDecoDefinitions[this.inputPanelType] ?? null;
      if (!this.selectedPanelDefinition) {
        console.error('ERROR: Panel has no definition', this.inputPanelType);
        return;
      }

      this.canSetHeight = this.selectedPanelDefinition.canSetHeight;
      if (!this.canSetHeight) {
        this.inputPanelHeight = currentH.toString();
      }

      this.panelStatusOptions = this.selectedPanelDefinition?.statuses
        ? this.selectedPanelDefinition?.statuses.map(status => {
            return { value: status, label: getLabelFromSlug(status) };
          })
        : [];

      const selectedPanel = this.panels.find(
        panel => panel.id === this.selectedPanelId
      );
      const { neighborN, neighborW } = this.getNeighbors(position);
      const neighborWValid = neighborW && neighborW.h > currentH + 3;
      const neighborNValid = neighborN && neighborN.h > currentH + 3;
      this.panelWallOptions = panelDecoWallOptions.filter(option => {
        if (option.value === 'west' && !neighborWValid) {
          return false;
        }
        if (option.value === 'north' && !neighborNValid) {
          return false;
        }
        return true;
      });
      this.panelHeightOptions = [];
      const relevantNeighborHeight =
        this.inputPanelWall === 'north' ? neighborN?.h : neighborW?.h;
      const minH = currentH;
      const maxH = relevantNeighborHeight ? relevantNeighborHeight : currentH;
      const diffH = maxH - minH - 4;
      if (diffH >= 0) {
        for (let i = 0; i <= diffH; i++) {
          const stringValue = `${minH + i}`;
          this.panelHeightOptions.push({
            value: stringValue,
            label: stringValue,
          });
        }
      }
    }
  }

  updatePanelPositionLockouts() {
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
          (!floor.walkable || (!neighborWValid && !neighborNValid)) &&
          !newLockouts.includes(position)
        ) {
          newLockouts.push(position);
        }
      });

      this.lockouts = newLockouts;
    }
  }

  ngOnInit() {
    this.updatePanelPositionLockouts();
    this.subscriptions.push(
      this._gameEditorService.selectedPanelIdObs.subscribe((data: string) => {
        this.selectedPanelId = data;
        this.panels = this._gameEditorService.getPanelsForCurrentArea();
        this.updateUiAfterPanelSelection(data);
        const selectedPanel = this.panels.find(
          panel => panel.id === this.selectedPanelId
        );
        if (selectedPanel) {
          this.selectedPanelActions = selectedPanel.statusActions || {};
        }
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: any) => {
        if (this.selectedAreaId !== data) {
          this.selectedAreaId = data;
          this.panels = this._gameEditorService.getPanelsForCurrentArea();
          this.area = this._gameEditorService.getAreaById(this.selectedAreaId);

          this.updatePanelPositionLockouts();
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
    this._gameEditorService.deletePanel(id);
  }

  updateUiAfterPanelSelection(id: string) {
    const selectedPanel = this.panels.find(panel => panel.id === id);
    this.inputPanelPosition = selectedPanel
      ? `${selectedPanel.y}_${selectedPanel.x}`
      : '';
    this.inputPanelType = selectedPanel ? selectedPanel.panelDecoType : '';
    this.inputPanelWall = selectedPanel ? selectedPanel.wall : 'north';
    this.inputPanelHeight = selectedPanel ? `${selectedPanel.h}` : '1';
    this.inputPanelStatus = selectedPanel ? `${selectedPanel.status}` : '';
    this.updatePanelPositionLockouts();
    this.refreshUIData();
  }

  handleEditClick(id: string) {
    this._gameEditorService.selectPanel(id);
    this.updateUiAfterPanelSelection(id);
  }

  handlePositionSelect(position: string) {
    this.inputPanelPosition = position;
    this.handlePanelInputChange();
  }

  handleCreateClick() {
    const panel: GamePanelDeco | null = this._gameEditorService.createPanel(
      this.lockouts
    );
    if (panel) {
      this.handleEditClick(panel.id);
    }
  }

  handlePanelInputChange() {
    this.refreshUIData();
    const selectedPanel = this.panels.find(
      panel => panel.id === this.selectedPanelId
    );
    const [y, x] = this.inputPanelPosition.split('_');

    if (selectedPanel) {
      const wall = this.panelWallOptions
        .map(option => option.value)
        .includes(this.inputPanelWall)
        ? this.inputPanelWall
        : this.panelWallOptions[0].value;

      this.inputPanelWall = wall;

      const updatedPanel: GamePanelDeco = {
        ...selectedPanel,
        id: this.selectedPanelId,
        panelDecoType: this.inputPanelType,
        areaId: this.selectedAreaId,
        wall,
        x: +x,
        y: +y,
        h: parseInt(this.inputPanelHeight, 10),
        status: this.inputPanelStatus,
        statusActions: this.selectedPanelActions,
      };
      this._gameEditorService.updatePanel(updatedPanel);

      this.refreshUIData();
    }
  }
  handlePanelActionInputChange(actions: ActionEffect[], status: string) {
    this.selectedPanelActions[status] = actions;
    this.handlePanelInputChange();
  }
}
