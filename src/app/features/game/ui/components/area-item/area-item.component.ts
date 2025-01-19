import { Component, Input } from '@angular/core';
import { GameItem } from '@app/features/main/interfaces/types';
import { defaultItem } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaItemPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgItemCoinsComponent } from './items/svg-item-coins/svg-item-coins.component';
import { SvgItemKeyComponent } from './items/svg-item-key/svg-item-key.component';

@Component({
  selector: 'app-area-item',
  standalone: true,
  imports: [SvgItemCoinsComponent, SvgItemKeyComponent],
  templateUrl: './area-item.component.html',
  styleUrl: './area-item.component.css',
})
export class AreaItemComponent {
  @Input('item') item: GameItem = defaultItem;

  gridSize: number = defaultGridSize;

  left: string = '';
  bottom: string = '';
  height: string = '0%';
  width: string = '0%';
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };

  updateItemProps() {
    if (this.item) {
      const { x, y, h } = this.item;
      const cellW = 100 / this.gridSize;
      this.position = getAreaItemPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
    }
  }

  ngOnChanges() {
    this.updateItemProps();
  }
  ngOnInit() {
    this.updateItemProps();
  }
}
