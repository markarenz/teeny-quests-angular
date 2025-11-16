import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameItem } from '@app/features/main/interfaces/types';
import { defaultItem } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgItemCoinsComponent } from './items/svg-item-coins/svg-item-coins.component';
import { SvgItemKeyComponent } from './items/svg-item-key/svg-item-key.component';
import { SvgItemBagOfCoinsComponent } from './items/svg-item-bag-of-coins/svg-item-bag-of-coins.component';
import { itemDefinitions } from '@content/item-definitions';

@Component({
  selector: 'app-area-item',
  standalone: true,
  imports: [
    SvgItemCoinsComponent,
    SvgItemKeyComponent,
    SvgItemBagOfCoinsComponent,
  ],
  templateUrl: './area-item.component.html',
  styleUrl: './area-item.component.css',
})
export class AreaItemComponent {
  @Input('item') item: GameItem = defaultItem;
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('lightLevel') lightLevel: number = 0;
  @Input('isNearPlayer') isNearPlayer: boolean = false;
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Output() onClick = new EventEmitter<string>();

  gridSize: number = defaultGridSize;

  left: string = '';
  bottom: string = '';
  height: string = '0%';
  width: string = '0%';
  isClickable: boolean = false;
  shouldDisplauHighlightBelow: boolean = false;
  positionStyle: AreaPosition = { left: '0', bottom: '0', z: 0 };
  ariaLabel: string = '';

  updateItemProps() {
    if (this.item) {
      const { x, y, h } = this.item;
      const cellW = 100 / this.gridSize;
      this.positionStyle = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Item ${this.item.y}_${this.item.x}`;
      const b = parseFloat(this.positionStyle.bottom.replace('%', ''));
      this.shouldDisplauHighlightBelow = b > 80;
      const itemDef = itemDefinitions[this.item.itemType];
      this.isClickable = itemDef?.action !== '';
    }
  }

  ngOnChanges() {
    this.updateItemProps();
  }
  ngOnInit() {
    this.updateItemProps();
  }
  handleClick() {
    if (
      !this.isLockedOut &&
      (this.isNearPlayer || this.isEditorMode) &&
      this.isClickable
    ) {
      this.onClick.emit(this.item.id);
    }
  }
}
