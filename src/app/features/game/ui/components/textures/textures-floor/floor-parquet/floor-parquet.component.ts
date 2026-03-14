import { Component, Input, Output, EventEmitter } from '@angular/core';
import { defaultFloorProps, FloorProps } from '../floor-utils';

@Component({
  selector: 'app-floor-parquet',
  imports: [],
  templateUrl: './floor-parquet.component.html',
  styleUrl: './floor-parquet.component.css',
  standalone: true,
})
export class FloorParquetComponent {
  @Input('floorProps') floorProps: FloorProps = defaultFloorProps;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    this.onClick.emit('dirt');
  }
}
