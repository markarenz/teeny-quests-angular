import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameAreaExit } from '@app/features/main/interfaces/types';
import { defaultExit } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgExitDefaultWComponent } from './exits/svg-exit-default-w/svg-exit-default-w.component';
import { SvgExitDefaultNComponent } from './exits/svg-exit-default-n/svg-exit-default-n.component';
import { SvgExitDefaultSComponent } from './exits/svg-exit-default-s/svg-exit-default-s.component';
import { SvgExitDefaultEComponent } from './exits/svg-exit-default-e/svg-exit-default-e.component';

@Component({
  selector: 'app-area-exit',
  standalone: true,
  imports: [
    SvgExitDefaultWComponent,
    SvgExitDefaultNComponent,
    SvgExitDefaultSComponent,
    SvgExitDefaultEComponent,
  ],
  templateUrl: './area-exit.component.html',
  styleUrl: './area-exit.component.css',
})
export class AreaExitComponent {
  @Input('exit') exit: GameAreaExit = defaultExit;
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Output() onClick = new EventEmitter<string>();
  gridSize: number = defaultGridSize;

  left: string = '';
  bottom: string = '';
  height: string = '0%';
  width: string = '0%';
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  ariaLabel: string = '';

  selectedIndicatorPositions: { [key: string]: string } = {
    north: 'top-[15%] left-[50%]',
    south: 'top-[35%] left-[0%]',
    east: 'top-[35%] left-[50%]',
    west: 'top-[15%] left-[0%]',
  };
  updateExitProps() {
    if (this.exit) {
      const { x, y, h } = this.exit;
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Exit ${this.exit.y}_${this.exit.x}`;
    }
  }

  ngOnChanges() {
    this.updateExitProps();
  }

  ngOnInit() {
    this.updateExitProps();
  }
  handleClick() {
    if (this.isClickable) {
      this.onClick.emit(this.exit.id);
    }
  }
}
