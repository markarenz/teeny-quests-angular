import { Component, Input, Output, EventEmitter } from '@angular/core';
import { floorDefinitions } from '@content/floor-definitions';
import {
  getFillTextureUrl,
  getPositionIndexIsOdd,
  getTextureId,
  getPolyPoints,
  getFloorProps,
  defaultFloorProps,
} from './floor-utils';
import { FloorDirtComponent } from './floor-dirt/floor-dirt.component';
import { FloorWaterComponent } from './floor-water/floor-water.component';
import { FloorStoneDarkComponent } from './floor-stone-dark/floor-stone-dark.component';
import { FloorParquetComponent } from './floor-parquet/floor-parquet.component';
import { FloorRoofComponent } from './floor-roof/floor-roof.component';
import { FloorSpikesComponent } from './floor-spikes/floor-spikes.component';
import { FloorWallTopComponent } from './floor-wall-top/floor-wall-top.component';
import { FloorTileDarkComponent } from './floor-tile-dark/floor-tile-dark.component';
import { FloorDefaultComponent } from './floor-default/floor-default.component';
import { FloorRoofSimpleComponent } from './floor-roof-simple/floor-roof-simple.component';
import { FloorGrassComponent } from './floor-grass/floor-grass.component';

@Component({
  selector: 'app-textures-floor',
  imports: [
    FloorDirtComponent,
    FloorWaterComponent,
    FloorStoneDarkComponent,
    FloorParquetComponent,
    FloorRoofComponent,
    FloorSpikesComponent,
    FloorWallTopComponent,
    FloorTileDarkComponent,
    FloorDefaultComponent,
    FloorRoofSimpleComponent,
    FloorGrassComponent,
  ],
  templateUrl: './textures-floor.component.html',
  styleUrl: './textures-floor.component.css',
  standalone: true,
})
export class TexturesFloorComponent {
  @Input('floorType') floorType: string = 'default';
  @Input('isFlat') isFlat: boolean = false;
  @Input('isHighlighted') isHighlighted: boolean = false;
  @Input('positionKey') positionKey: string = '';
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Output() onClick = new EventEmitter<string>();

  public floorDefinitions = floorDefinitions;
  public getPositionIndexIsOdd = getPositionIndexIsOdd;
  public getFillTextureUrl = getFillTextureUrl;
  public getTextureId = getTextureId;
  public getPolyPoints = getPolyPoints;
  public floorProps = this.getFloorPropsLocal();

  private getFloorPropsLocal() {
    if (!this.floorType || !floorDefinitions[this.floorType]) {
      return defaultFloorProps;
    }

    return getFloorProps(
      this.isFlat,
      this.isEditorMode,
      this.positionKey,
      floorDefinitions[this.floorType]
    );
  }

  ngOnInit() {
    this.floorProps = this.getFloorPropsLocal();
  }

  ngOnChanges() {
    this.floorProps = this.getFloorPropsLocal();
  }

  public handleClick() {
    this.onClick.emit(this.positionKey);
  }
}
