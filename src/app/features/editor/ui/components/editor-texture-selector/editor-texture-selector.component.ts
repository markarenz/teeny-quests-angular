import { Component, Output, Input, EventEmitter } from '@angular/core';
import { TexturesFloorComponent } from '@app/features/game/ui/components/textures/textures-floor/textures-floor.component';
import { TexturesWallComponent } from '@app/features/game/ui/components/textures/textures-wall/textures-wall.component';
import { SelectIUIOption } from '@app/features/main/interfaces/types';
import { TooltipComponent } from '@app/features/main/ui/components/tooltip/tooltip.component';

@Component({
  selector: 'app-editor-texture-selector',
  imports: [TexturesFloorComponent, TexturesWallComponent, TooltipComponent],
  templateUrl: './editor-texture-selector.component.html',
  styleUrl: './editor-texture-selector.component.css',
  standalone: true,
})
export class EditorTextureSelectorComponent {
  @Input('surfaceType') surfaceType: string = 'floor';
  @Input('selectedId') selectedId: string = '';
  @Input('options') options: SelectIUIOption[] = [
    {
      value: '',
      label: '',
    },
  ];
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  handleTextureSelect(value: string) {
    this.onSelect.emit(value);
  }
}
