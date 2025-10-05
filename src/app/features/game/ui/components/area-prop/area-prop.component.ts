import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameProp } from '@app/features/main/interfaces/types';
import { defaultProp } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgPropTorchComponent } from './props/svg-prop-torch/svg-prop-torch.component';
import { SvgPropSwitchComponent } from './props/svg-prop-switch/svg-prop-switch.component';
import { propDecoDefinitions } from '@content/prop-definitions';

@Component({
  selector: 'app-area-prop',
  standalone: true,
  imports: [SvgPropTorchComponent, SvgPropSwitchComponent],
  templateUrl: './area-prop.component.html',
  styleUrl: './area-prop.component.css',
})
export class AreaPropComponent {
  @Input('prop') prop: GameProp = defaultProp;
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('isNearPlayer') isNearPlayer: boolean = false;
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Output() onClick = new EventEmitter<string>();
  gridSize: number = defaultGridSize;

  left: string = '';
  bottom: string = '';
  height: string = '0%';
  width: string = '0%';
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  ariaLabel: string = '';

  updatePropProps() {
    if (this.prop) {
      const { x, y, h } = this.prop;
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Prop ${this.prop.y}_${this.prop.x}`;
      this.isClickable =
        propDecoDefinitions[this.prop.propType]?.isClickable ?? false;
    }
  }

  ngOnChanges() {
    this.updatePropProps();
  }

  ngOnInit() {
    this.updatePropProps();
  }
  handleClick() {
    if (this.isClickable || this.isEditorMode) {
      this.onClick.emit(this.prop.id);
    }
  }
}
