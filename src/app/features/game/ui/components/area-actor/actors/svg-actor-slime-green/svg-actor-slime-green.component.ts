import { Component, Input } from '@angular/core';
import { ActorStatus } from '@app/features/main/interfaces/enums';

@Component({
  selector: 'app-svg-actor-slime-green',
  imports: [],
  templateUrl: './svg-actor-slime-green.component.html',
  styleUrl: './svg-actor-slime-green.component.css',
})
export class SvgActorSlimeGreenComponent {
  @Input('isActorSelected') isActorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('status') status: ActorStatus = ActorStatus.IDLE;
  @Input('relativePlayerXPos') relativePlayerXPos: number = 0;

  public eyesDirection = 0;

  ngOnChanges() {
    // is the player in this room?
    // if so, is the player to my left or right?
  }
}
