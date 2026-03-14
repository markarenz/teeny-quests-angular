import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-roof-simple',
  imports: [],
  templateUrl: './floor-roof-simple.component.html',
  styleUrl: './floor-roof-simple.component.css',
  standalone: true,
})
export class FloorRoofSimpleComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('roof-simple');
  }
}
