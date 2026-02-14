import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-stone-dark',
  standalone: true,
  imports: [],
  templateUrl: './floor-stone-dark.component.html',
  styleUrl: './floor-stone-dark.component.css',
})
export class FloorStoneDarkComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
