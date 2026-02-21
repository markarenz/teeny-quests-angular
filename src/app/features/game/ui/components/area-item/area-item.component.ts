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
import { SvgItemDiamondComponent } from './items/svg-item-diamond/svg-item-diamond.component';
import { SvgItemEmeraldComponent } from './items/svg-item-emerald/svg-item-emerald.component';
import { SvgItemRubyComponent } from './items/svg-item-ruby/svg-item-ruby.component';
import { SvgItemSapphireComponent } from './items/svg-item-sapphire/svg-item-sapphire.component';
import { itemDefinitions } from '@content/item-definitions';

@Component({
  selector: 'app-area-item',
  standalone: true,
  imports: [
    SvgItemCoinsComponent,
    SvgItemKeyComponent,
    SvgItemBagOfCoinsComponent,
    SvgItemDiamondComponent,
    SvgItemEmeraldComponent,
    SvgItemRubyComponent,
    SvgItemSapphireComponent,
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
  @Input('inventoryItemType') inventoryItemType: string | null = null;
  @Output() onClick = new EventEmitter<string>();

  gridSize: number = defaultGridSize;

  public itemType: string = '';
  public left: string = '';
  public bottom: string = '';
  public height: string = '0%';
  public width: string = '0%';
  public isClickable: boolean = false;
  public isFlat: boolean = false;
  public shouldDisplayHighlightBelow: boolean = false;
  public positionStyle: AreaPosition = { left: '0', bottom: '0', z: 0 };
  public ariaLabel: string = '';

  updateItemProps() {
    if (this.inventoryItemType) {
      this.width = '100%';
      this.height = '100%';
      this.itemType = this.inventoryItemType;
      const itemDef = itemDefinitions[this.inventoryItemType];
      this.isClickable = false;
      this.positionStyle = { left: '0', bottom: '0', z: 0 };
      this.ariaLabel = itemDef
        ? `Inventory Item: ${itemDef.name}`
        : 'Inventory Item';
      this.shouldDisplayHighlightBelow = false;
      this.isFlat = true;
    } else {
      const cellW = 100 / this.gridSize;
      this.width = `${cellW}%`;
      const { x, y, h } = this.item;
      this.itemType = this.item.itemType;
      this.positionStyle = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.ariaLabel = `Select Item ${this.item.y}_${this.item.x}`;
      const b = parseFloat(this.positionStyle.bottom.replace('%', ''));
      this.shouldDisplayHighlightBelow = b > 80;
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
