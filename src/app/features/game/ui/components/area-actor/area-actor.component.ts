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
// import { AnimStatus, ActorType } from '@app/features/main/interfaces/enums';
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
  public currentHealth: number = 0;
  public maxHealth: number = 0;
  public healthPercent: number = 100;
  public relativePlayerXPos: number = 0; // -1 to left, 1 to right
  public isHurt: boolean = false;

  getNumFromPositionString(position: string): number {
    return parseInt(position.replace('%', ''));
  }
  updateActorProps() {
    if (this.actor) {
      const { x, y, h, actorType } = this.actor;
      const actorDef = actorDefinitions[actorType];
      const cellW = 100 / this.gridSize;
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Actor ${this.actor.y}_${this.actor.x}`;
      this.maxHealth = actorDef ? actorDef.maxHealth : 0;
      if (this.actor.health < this.currentHealth) {
        this.isHurt = true;
        setTimeout(() => {
          this.isHurt = false;
        }, 500);
      }
      this.currentHealth = this.actor.health;
      this.healthPercent =
        this.maxHealth > 0 ? (this.actor.health / this.maxHealth) * 100 : 0;
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
    this.onClick.emit(this.actor.id);
  }
}
