import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from './constants';
import { BlueShineComponent } from './blue-shine/blue-shine.component';
import { CaveComponent } from './cave/cave.component';
import { RedStoneComponent } from './red-stone/red-stone.component';
import { WallDefaultComponent } from './wall-default/wall-default.component';

@Component({
  selector: 'app-textures-wall',
  standalone: true,
  imports: [
    BlueShineComponent,
    CaveComponent,
    RedStoneComponent,
    WallDefaultComponent,
  ],
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

  public readonly halfUnit = 12.5;
  public textureId: string = '';
  public textureYOffset: number = 0;
  public wallTexture: string = '';
  public wallProps: WallTextureProps = defaultWallProps;

  private getWallTextureProps(): WallTextureProps {
    return {
      wallType: this.wallType,
      svgViewBox: this.svgViewBox,
      wallPosition: this.wallPosition,
      wallTexture: this.wallTexture,
      textureId: this.textureId,
      svgPolygonPoints: this.svgPolygonPoints,
      h: this.h,
    };
  }

  updateProps() {
    this.textureYOffset = this.h % 2 === 0 ? 0.055 : 0;
    this.textureId = `texture_${this.positionKey}_${this.wallPosition}_${this.isFlat ? 'flat' : 'wall'}`;
    this.wallTexture = `url(#${this.textureId})`;
    this.wallProps = this.getWallTextureProps();
  }

  ngOnChanges() {
    this.updateProps();
  }
  public getHalfUnitHright(y: number): number {
    return (y - 1) * this.halfUnit;
  }

  ngOnInit() {
    this.updateProps();
  }
}
