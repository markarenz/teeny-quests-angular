import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-dirt',
  standalone: true,
  imports: [],
  templateUrl: './floor-dirt.component.html',
  styleUrl: './floor-dirt.component.css',
})
export class FloorDirtComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
