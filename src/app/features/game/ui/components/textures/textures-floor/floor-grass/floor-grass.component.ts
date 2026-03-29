import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-grass',
  imports: [],
  templateUrl: './floor-grass.component.html',
  styleUrl: './floor-grass.component.css',
  standalone: true,
})
export class FloorGrassComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  public isFlipped = this.floorProps.textureId.includes('flip');

  handleClick() {
    this.onClick.emit('dirt');
  }
}
