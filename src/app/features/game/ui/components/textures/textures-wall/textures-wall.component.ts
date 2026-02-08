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

  public textureId: string = '';
  public textureYOffset: number = 0;
  public wallTexture: string = '';
  public halfUnits: number[] = [];

  updateProps() {
    this.textureYOffset = this.h % 2 === 0 ? 0.055 : 0;
    this.textureId = `texture_${this.positionKey}_${this.wallPosition}_${this.isFlat ? 'flat' : 'wall'}`;
    this.wallTexture = `url(#${this.textureId})`;
  }

  ngOnChanges() {
    this.updateProps();
  }
  ngOnInit() {
    for (let i = 0; i < 26; i++) {
      this.halfUnits.push((i - 1) * 12.5);
    }
    this.updateProps();
  }
}
