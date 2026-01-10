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
  GameAreaExit,
  GameAreaMapCell,
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
  public selectedAreaId: string = '';
  public propTypeOptions: SelectIUIOption[] = propDecoOptions;

  public selectedPropDefinition: PropDefinition | null = null;
  public selectedPropActions: GameActionEffects = {};
  public inputPropType: string = '';
  public inputPropPosition: string = '1_1';
  public inputPropWall: string = 'west';
  public inputPropHeight = '1';
  public inputPropStatus: string = '';
  public inputPropName: string = '';
  public inputPropStatusEffects: GameActionEffects = {};

  public canSetHeight: boolean = true;
  public selectedPropId: string = '';
  public props: GameProp[] = [];
  public isSelectedPositionValid: boolean = false;

  public lockouts: string[] = [];
  public area: GameArea | null = null;
  public propWallOptions = propDecoWallOptions;
  public propStatusOptions: SelectIUIOption[] = [];
  public propHeightOptions: SelectIUIOption[] = [];

  public getNeighbors(position: string): { neighborN: any; neighborW: any } {
    if (!this.area) return { neighborN: null, neighborW: null };
    const map = this.area.map;
    const [y, x] = position.split('_').map(Number);
    const neighborN = map[`${y - 1}_${x}`] || null;
    const neighborW = map[`${y}_${x - 1}`] || null;
    return { neighborN, neighborW };
  }

  private getExitOnCell = (y: number, x: number): GameAreaExit | null => {
    return (
      this.area?.exits.find(exit => exit.x === +x && exit.y === +y) || null
    );
  };

  private getPropWallOptions = (
    position: string,
    neighborN: GameAreaMapCell | null = null,
    neighborW: GameAreaMapCell | null = null,
    currentH: number = 0
  ): SelectIUIOption[] => {
    const [y, x] = position.split('_').map(Number);
    const exitOnCell = this.getExitOnCell(y, x);
    const prop = this.props?.find(prop => prop.x === x && prop.y === y);
    const neighborWValid = neighborW && neighborW.h > currentH + 3;
    const neighborNValid = neighborN && neighborN.h > currentH + 3;

    return propDecoWallOptions.filter(option => {
      if (prop && option.value === prop.wall) {
        return true;
      }
      if (exitOnCell && option.value === exitOnCell.direction) {
        return false;
      }
      if (option.value === 'west' && !neighborWValid) {
        return false;
      }
      if (option.value === 'north' && !neighborNValid) {
        return false;
      }
      return true;
    });
  };

  public refreshUIData() {
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
      const { neighborN, neighborW } = this.getNeighbors(position);
      this.propWallOptions = this.getPropWallOptions(
        position,
        neighborN,
        neighborW,
        currentH
      );
      if (this.propWallOptions.length === 0) {
        console.error('ERROR: No valid walls for prop placement');
        this.propWallOptions = propDecoWallOptions;
      }
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

  public updatePropPositionLockouts() {
    if (this.area) {
      const newLockouts: string[] = [];
      const positionKeys = getPositionKeysForGridSize();
      const map = this.area.map;
      this.area.items.forEach(item => {
        newLockouts.push(`${item.y}_${item.x}`);
      });
      this.area.props.forEach(prop => {
        if (prop.id !== this.selectedPropId) {
          newLockouts.push(`${prop.y}_${prop.x}`);
        }
      });
      // this.area.exits.forEach(exit => {
      //   // If there is an exit AND a prop, lock out that position
      //   if (
      //     this.area?.props.some(
      //       prop =>
      //         this.selectedPropId !== prop.id &&
      //         prop.x === exit.x &&
      //         prop.y === exit.y
      //     )
      //   ) {
      //     newLockouts.push(`${exit.y}_${exit.x}`);
      //   }
      // });
      positionKeys.forEach((position: string) => {
        const floor = floorDefinitions[map[position].floor];
        const currentH = map[position].h;

        const { neighborN, neighborW } = this.getNeighbors(position);
        const wallOptions = this.getPropWallOptions(
          position,
          neighborN,
          neighborW,
          currentH
        );
        const wallOptionValid = wallOptions.length > 0;
        const cellValid =
          floor.walkable && !map[position].isHidden && currentH > 0;
        if (
          (!wallOptionValid || !cellValid) &&
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

  private updatePanelProps = () => {
    this.props = this._gameEditorService.getPropsForCurrentArea();
  };

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public handleDeleteClick(id: string) {
    this._gameEditorService.deleteProp(id);
  }

  public updateUiAfterPropSelection(id: string) {
    const selectedProp = this.props.find(prop => prop.id === id);
    this.inputPropPosition = selectedProp
      ? `${selectedProp.y}_${selectedProp.x}`
      : '';
    this.inputPropType = selectedProp ? selectedProp.propType : '';

    this.inputPropWall = selectedProp ? selectedProp.wall : 'north';
    this.inputPropHeight = selectedProp ? `${selectedProp.h}` : '1';
    this.inputPropStatus = selectedProp ? `${selectedProp.status}` : '';
    this.inputPropName = selectedProp ? `${selectedProp.name || ''}` : '';
    this.updatePropPositionLockouts();
    this.refreshUIData();
  }

  public handleEditClick(id: string) {
    if (this.selectedPropId === id) {
      this._gameEditorService.selectProp('');
      this.selectedPropId = '';
      return;
    }
    this._gameEditorService.selectProp(id);
    this.updateUiAfterPropSelection(id);
  }

  public handlePositionSelect(position: string) {
    this.inputPropPosition = position;
    this.handlePropInputChange();
  }

  public handleCreateClick() {
    const prop: GameProp | null = this._gameEditorService.createProp(
      this.lockouts
    );
    if (prop) {
      this.handleEditClick(prop.id);
    }
  }

  public handlePropInputChange() {
    this.refreshUIData();
    const selectedProp = this.props.find(
      prop => prop.id === this.selectedPropId
    );
    const [y, x] = this.inputPropPosition.split('_');
    if (selectedProp) {
      let wall = this.propWallOptions
        .map(option => option.value)
        .includes(this.inputPropWall)
        ? this.inputPropWall
        : this.propWallOptions[0].value;
      // If we are moving the prop to a location with an exit, adjust the wall if needed
      const exitOnCell = this.area?.exits.find(
        exit => exit.x === +x && exit.y === +y
      );
      if (exitOnCell && exitOnCell.direction === selectedProp?.wall) {
        wall = selectedProp?.wall === 'north' ? 'west' : 'north';
      }

      this.inputPropWall = wall;
      const updatedProp: GameProp = {
        ...selectedProp,
        id: this.selectedPropId,
        name: this.inputPropName,
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
      this.updatePanelProps();
      this.refreshUIData();
    }
  }

  public handlePropActionInputChange(actions: ActionEffect[], status: string) {
    this.selectedPropActions[status] = actions;
    this.handlePropInputChange();
  }
}
