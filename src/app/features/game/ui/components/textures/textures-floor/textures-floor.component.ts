import { Component, Input } from '@angular/core';

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
  floorTexture: string = `url(#texture-${this.floorType ?? 'default'})`;
}
