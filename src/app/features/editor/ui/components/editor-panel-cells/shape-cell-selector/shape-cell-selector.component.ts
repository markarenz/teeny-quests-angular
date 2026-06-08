import { Component, Output, EventEmitter } from '@angular/core';
import { shapePositionKeys } from './constants';

@Component({
  selector: 'app-shape-cell-selector',
  imports: [],
  templateUrl: './shape-cell-selector.component.html',
  styleUrl: './shape-cell-selector.component.css',
})
export class ShapeCellSelectorComponent {
  @Output() handleShapeSelect = new EventEmitter<string[]>();
  public isOpen: boolean = false;

  public shapeOptions = ['All', 'Ring-7', 'Ring-5', 'Center-5', 'Center-3'];
  handleToggleShapeSelect() {
    this.isOpen = !this.isOpen;
  }
  handleShapeOptionSelect(option: string) {
    const positions =
      shapePositionKeys[option as keyof typeof shapePositionKeys];
    this.handleShapeSelect.emit(positions);

    this.isOpen = false;
  }
}
