import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { QuestActor } from '@app/features/main/interfaces/types';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaElementPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgActorSlimeGreenComponent } from './actors/svg-actor-slime-green/svg-actor-slime-green.component';
import { actorDefinitions } from '@content/actor-definitions';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { ActorStatus, ActorType } from '@app/features/main/interfaces/enums';
import { defaultActor } from '@app/features/game/lib/constants';

@Component({
  selector: 'app-area-actor',
  imports: [SvgActorSlimeGreenComponent],
  templateUrl: './area-actor.component.html',
  styleUrl: './area-actor.component.css',
})
export class AreaActorComponent {
  constructor(private _audioService: AudioService) {}

  @Input('actor') actor: QuestActor = defaultActor;
  // @Input('actor') set data(value: QuestActor) {
  //   this.actor = value;
  //   this.updateActorProps();
  // }

  @Input('isEditorMode') isEditorMode: boolean = false;
  @Input('isActorSelected') isActorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Input('lightLevel') lightLevel: number = 0;
  @Input('playerPosition') playerPosition: string = '-1_-1';
  @Output() onClick = new EventEmitter<string>();
  gridSize: number = defaultGridSize;

  // public actor: QuestActor = defaultActor;
  public left: string = '';
  public bottom: string = '';
  public height: string = '0%';
  public width: string = '0%';
  public position: AreaPosition = { left: '0', bottom: '0', z: 0 };
  public ariaLabel: string = '';
  public relativePlayerXPos: number = 0; // -1 to left, 1 to right

  getNumFromPositionString(position: string): number {
    return parseInt(position.replace('%', ''));
  }
  updateActorProps() {
    if (this.actor) {
      const { x, y, h } = this.actor;
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Actor ${this.actor.y}_${this.actor.x}`;
      if (this.playerPosition !== '-1_-1') {
        const [playerY, playerX] = this.playerPosition.split('_').map(Number);
        const playerPosition = getAreaElementPositionStyle(
          this.gridSize,
          playerY,
          playerX,
          0
        );
        this.relativePlayerXPos = 0;
        const margin = 3;
        const pl: number = this.getNumFromPositionString(playerPosition.left);
        const al: number = this.getNumFromPositionString(this.position.left);
        if (pl < al - margin) {
          this.relativePlayerXPos = -1;
        } else if (pl > al + margin) {
          this.relativePlayerXPos = 1;
        }
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.updateActorProps();
  }

  ngOnInit() {
    this.updateActorProps();
  }
  handleClick() {
    if (this.isEditorMode) {
      this.onClick.emit(this.actor.id);
    }
  }
  public handleMouseDown(): void {
    console.log('Mouse down on actor', this.actor);
  }
}
