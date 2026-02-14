import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FloorProps, defaultFloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-water',
  standalone: true,
  imports: [],
  templateUrl: './floor-water.component.html',
  styleUrl: './floor-water.component.css',
})
export class FloorWaterComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
