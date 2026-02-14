import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-tile-dark',
  standalone: true,
  imports: [],
  templateUrl: './floor-tile-dark.component.html',
  styleUrl: './floor-tile-dark.component.css',
})
export class FloorTileDarkComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
