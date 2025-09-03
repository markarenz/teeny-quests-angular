import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GamePanelDeco } from '@app/features/main/interfaces/types';
import { defaultPanelDeco } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgPanelTorchComponent } from './panelDecor/svg-panel-torch/svg-panel-torch.component';
import { SvgPanelSwitchComponent } from './panelDecor/svg-panel-switch/svg-panel-switch.component';

@Component({
  selector: 'app-area-panel',
  standalone: true,
  imports: [SvgPanelTorchComponent, SvgPanelSwitchComponent],
  templateUrl: './area-panel.component.html',
  styleUrl: './area-panel.component.css',
})
export class AreaPanelComponent {
  @Input('panel') panel: GamePanelDeco = defaultPanelDeco;
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Input('isPanelSelected') isPanelSelected: boolean = false;
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

  updatePanelProps() {
    if (this.panel) {
      const { x, y, h } = this.panel;
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Panel/Decor ${this.panel.y}_${this.panel.x}`;
    }
  }

  ngOnChanges() {
    this.updatePanelProps();
  }

  ngOnInit() {
    this.updatePanelProps();
  }
  handleClick() {
    if (this.isClickable) {
      this.onClick.emit(this.panel.id);
    }
  }
}
