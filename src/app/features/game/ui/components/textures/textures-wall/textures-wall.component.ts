import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-textures-wall',
  standalone: true,
  imports: [],
  templateUrl: './textures-wall.component.html',
  styleUrl: './textures-wall.component.css',
})
export class TexturesWallComponent {
  @Input('wallType') wallType: string = 'default';
  @Input('wallPosition') wallPosition: string = 'l';
  @Input('positionKey') positionKey: string = '';
  @Input('svgViewBox') svgViewBox: string = '';
  @Input('svgPolygonPoints') svgPolygonPoints: string[] = [];
  @Input('isFlat') isFlat: boolean = false;
  @Input('h') h: number = 1;

  textureYOffset: number = 0;
  wallTexture: string = '';

  updateProps() {
    this.textureYOffset = this.h % 2 === 0 ? 0.5 : 0;
    this.wallTexture = `url(#texture_${this.positionKey}_${this.wallPosition}_${
      this.isFlat ? 'flat' : 'wall'
    })`;
  }

  ngOnChanges() {
    this.updateProps();
  }
  ngOnInit() {
    this.updateProps();
  }
}
