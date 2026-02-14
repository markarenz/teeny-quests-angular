import { Component, Input, Output, EventEmitter } from '@angular/core';
import { floorDefinitions } from '@content/floor-definitions';

@Component({
  selector: 'app-textures-floor',
  standalone: true,
  imports: [],
  templateUrl: './textures-floor.component.html',
  styleUrl: './textures-floor.component.css',
})
export class TexturesFloorComponent {
  @Input('floorType') floorType: string = 'default';
  @Input('isFlat') isFlat: boolean = false;
  @Input('positionKey') positionKey: string = '';
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Output() onClick = new EventEmitter<string>();

  public floorDefinitions = floorDefinitions;

  public getPositionIndex() {
    return this.positionKey
      .split('_')
      .map(Number)
      .reduce((acc, val) => {
        return acc + val;
      }, 0);
  }

  public getPositionIndexIsOdd() {
    return this.getPositionIndex() % 2 !== 0;
  }

  public handleClick() {
    this.onClick.emit(this.positionKey);
  }
}
