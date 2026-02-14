import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-spikes',
  standalone: true,
  imports: [],
  templateUrl: './floor-spikes.component.html',
  styleUrl: './floor-spikes.component.css',
})
export class FloorSpikesComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
