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
  @Input('svgViewBox') svgViewBox: string = '';
  @Input('svgPolygonPoints') svgPolygonPoints: string[] = [];
  @Input('isFlat') isFlat: boolean = false;
  h: number = 100;
  w: number = 100;
  wallTexture: string = '';

  ngOnInit() {
    this.wallTexture = `url(#texture_${this.wallType}_${this.wallPosition}_${
      this.isFlat ? 'flat' : 'wall'
    })`;
  }
}
