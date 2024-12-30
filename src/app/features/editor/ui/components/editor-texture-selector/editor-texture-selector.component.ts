import { Component, Output, Input, EventEmitter } from '@angular/core';
import { TexturesFloorComponent } from '@app/features/game/ui/components/textures/textures-floor/textures-floor.component';
import { TexturesWallComponent } from '@app/features/game/ui/components/textures/textures-wall/textures-wall.component';

@Component({
  selector: 'app-editor-texture-selector',
  standalone: true,
  imports: [TexturesFloorComponent, TexturesWallComponent],
  templateUrl: './editor-texture-selector.component.html',
  styleUrl: './editor-texture-selector.component.css',
})
export class EditorTextureSelectorComponent {
  @Input('surfaceType') surfaceType: string = 'floor';
  @Input('selectedId') selectedId: string = '';
  @Input('options') options: { id: string; name: string }[] = [
    {
      id: '',
      name: '',
    },
  ];
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  handleTextureSelect(id: string) {
    this.onSelect.emit(id);
  }
}
