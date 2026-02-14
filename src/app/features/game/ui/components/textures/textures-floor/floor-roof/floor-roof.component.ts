import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-roof',
  standalone: true,
  imports: [],
  templateUrl: './floor-roof.component.html',
  styleUrl: './floor-roof.component.css',
})
export class FloorRoofComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
