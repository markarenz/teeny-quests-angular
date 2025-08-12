import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  public handleClick() {
    this.onClick.emit(this.positionKey);
  }
}
