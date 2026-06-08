import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-lava',
  imports: [],
  templateUrl: './floor-lava.component.html',
  styleUrl: './floor-lava.component.css',
  standalone: true,
})
export class FloorLavaComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('lava');
  }
}
