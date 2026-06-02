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
import { SvgActorSkelloComponent } from './actors/svg-actor-skello/svg-actor-skello.component';
import { SvgActorBehttComponent } from './actors/svg-actor-behtt/svg-actor-behtt.component';
import { SvgActorShopComponent } from './actors/svg-actor-shop/svg-actor-shop.component';
import { actorDefinitions } from '@content/actor-definitions';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { defaultActor } from '@app/features/game/lib/constants';
import {
  ActorInteractionType,
  AnimStatus,
  Direction,
} from '@app/features/main/interfaces/enums';

@Component({
  selector: 'app-area-actor',
  imports: [
    SvgActorSlimeGreenComponent,
    SvgActorSkelloComponent,
    SvgActorBehttComponent,
    SvgActorShopComponent,
  ],
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
  @Input('showHealthBar') showHealthBar: boolean = true;
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
  public size: 'sm' | 'md' | 'lg' = 'md';
  public buttonTop: string = '0%';
  public isHostile: boolean = false;
  public relativePlayerXPos: number = 0; // -1 to left, 1 to right
  public zOffset: number = 0;
  public actorSize: 'sm' | 'md' | 'lg' = 'sm';

  getNumFromPositionString(position: string): number {
    return parseInt(position.replace('%', ''));
  }
  getZOffset(): number {
    if (this.actor.animStatus === AnimStatus.ATTACKING) {
      if (this.actor.facing === Direction.SOUTH) {
        return 1;
      }
      if (this.actor.facing === Direction.EAST) {
        return 7;
      }
    }
    return 0;
  }
  updateActorProps() {
    if (this.actor) {
      const { x, y, h, actorType } = this.actor;
      const actorDef = actorDefinitions[actorType];
      const cellW = 100 / this.gridSize;
      this.size = actorDef ? actorDef.size : 'md';
      this.buttonTop = actorDef ? actorDef.buttonTop : '0%';
      this.position = getAreaElementPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
      this.ariaLabel = `Select Actor ${this.actor.y}_${this.actor.x}`;
      this.maxHealth = actorDef ? actorDef.maxHealth : 0;
      this.actorSize = actorDef ? actorDef.size : 'sm';
      this.isHostile = actorDef
        ? actorDef.interactionType === ActorInteractionType.HOSTILE
        : false;
      if (!actorDef) {
        console.warn('Actor definition not found for actor type:', actorType);
      }
      this.zOffset = this.getZOffset();
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
