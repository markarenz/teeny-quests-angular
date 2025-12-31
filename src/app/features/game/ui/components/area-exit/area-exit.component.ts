import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameAreaExit } from '@app/features/main/interfaces/types';
import { defaultExit } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgExitDefaultWComponent } from './exits/svg-exit-default-w/svg-exit-default-w.component';
import { SvgExitDefaultNComponent } from './exits/svg-exit-default-n/svg-exit-default-n.component';
import { SvgExitDefaultSComponent } from './exits/svg-exit-default-s/svg-exit-default-s.component';
import { SvgExitDefaultEComponent } from './exits/svg-exit-default-e/svg-exit-default-e.component';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

@Component({
  selector: 'app-area-exit',
  standalone: true,
  imports: [
    SvgExitDefaultWComponent,
    SvgExitDefaultNComponent,
    SvgExitDefaultSComponent,
    SvgExitDefaultEComponent,
  ],
  templateUrl: './area-exit.component.html',
  styleUrl: './area-exit.component.css',
})
export class AreaExitComponent {
  constructor(private _audioService: AudioService) {}

  @Input('exit') exit: GameAreaExit = defaultExit;
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('lightLevel') lightLevel: number = 0;
  @Input('isClickable') isClickable: boolean = false;
  @Input('isNearPlayer') isNearPlayer: boolean = false;
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Output() onClick = new EventEmitter<string>();
  public gridSize: number = defaultGridSize;
  public isLevelExit = false;

  public left: string = '';
  public bottom: string = '';
  public height: string = '0%';
  public width: string = '0%';
  public position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  public ariaLabel: string = '';

  selectedIndicatorPositions: { [key: string]: string } = {
    north: 'top-[15%] left-[55%]',
    south: 'top-[40%] left-[5%]',
    east: 'top-[40%] left-[55%]',
    west: 'top-[15%] left-[5%]',
  };
  zBumpMap: { [key: string]: number } = {
    north: -1,
    south: 1,
    east: 1,
    west: -1,
  };

  public getZIndex(): number {
    return Math.max(this.position.z + this.zBumpMap[this.exit.direction], 0);
  }

  public updateExitProps() {
    if (this.exit) {
      const { x, y, h } = this.exit;
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Exit ${this.exit.y}_${this.exit.x}`;
      this.isLevelExit = this.exit.exitType === 'game-end';
    }
  }

  public ngOnChanges() {
    this.updateExitProps();
  }

  ngOnInit() {
    this.updateExitProps();
  }
  public handleClick() {
    if (this.isClickable) {
      this.onClick.emit(this.exit.id);
    }
  }
  public handleMouseDown() {
    this._audioService.playSound('click1');
  }
}
