import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameProp } from '@app/features/main/interfaces/types';
import { defaultProp } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgPropTorchComponent } from './props/svg-prop-torch/svg-prop-torch.component';
import { SvgPropSwitchComponent } from './props/svg-prop-switch/svg-prop-switch.component';
import { SvgPropBannerComponent } from './props/svg-prop-banner/svg-prop-banner.component';
import { SvgPropGemFrameEmeraldComponent } from './props/svg-prop-gem-frame-emerald/svg-prop-gem-frame-emerald.component';
import { SvgPropGemFrameSapphireComponent } from './props/svg-prop-gem-frame-sapphire/svg-prop-gem-frame-sapphire.component';
import { SvgPropGemFrameRubyComponent } from './props/svg-prop-gem-frame-ruby/svg-prop-gem-frame-ruby.component';
import { SvgPropGemFrameDiamondComponent } from './props/svg-prop-gem-frame-diamond/svg-prop-gem-frame-diamond.component';
import { propDecoDefinitions } from '@content/prop-definitions';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

@Component({
  selector: 'app-area-prop',
  standalone: true,
  imports: [
    SvgPropTorchComponent,
    SvgPropSwitchComponent,
    SvgPropBannerComponent,
    SvgPropGemFrameEmeraldComponent,
    SvgPropGemFrameSapphireComponent,
    SvgPropGemFrameRubyComponent,
    SvgPropGemFrameDiamondComponent,
  ],
  templateUrl: './area-prop.component.html',
  styleUrl: './area-prop.component.css',
})
export class AreaPropComponent {
  constructor(private _audioService: AudioService) {}

  @Input('prop') prop: GameProp = defaultProp;
  @Input('isEditorMode') isEditorMode: boolean = false;
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('isNearPlayer') isNearPlayer: boolean = false;
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Input('lightLevel') lightLevel: number = 0;
  @Output() onClick = new EventEmitter<string>();
  gridSize: number = defaultGridSize;

  public isTouched: boolean = false;
  public left: string = '';
  public bottom: string = '';
  public height: string = '0%';
  public width: string = '0%';
  public position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  public ariaLabel: string = '';

  updatePropProps() {
    if (this.prop) {
      const { x, y, h } = this.prop;
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Prop ${this.prop.y}_${this.prop.x}`;
      this.isClickable =
        propDecoDefinitions[this.prop.propType]?.isClickable ?? false;
    }
  }

  ngOnChanges() {
    this.updatePropProps();
  }

  ngOnInit() {
    this.updatePropProps();
  }
  handleClick() {
    if (this.isClickable || this.isEditorMode) {
      this.isTouched = true;
      setTimeout(() => {
        this.isTouched = false;
      }, 500);
      this.onClick.emit(this.prop.id);
    }
  }
  public handleMouseDown(): void {
    if (!this.isEditorMode) {
      const sound = propDecoDefinitions[this.prop.propType]?.sound;
      if (sound) {
        this._audioService.playSound(sound);
      }
    }
  }
}
