import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-wall-top',
  imports: [],
  templateUrl: './floor-wall-top.component.html',
  styleUrl: './floor-wall-top.component.css',
  standalone: true,
})
export class FloorWallTopComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
