import { Component, Input } from '@angular/core';
import { AnimStatus } from '@app/features/main/interfaces/enums';

@Component({
  selector: 'app-svg-actor-behtt',
  imports: [],
  templateUrl: './svg-actor-behtt.component.html',
  styleUrl: './svg-actor-behtt.component.css',
})
export class SvgActorBehttComponent {
  @Input('isActorSelected') isActorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('status') status: AnimStatus = AnimStatus.IDLE;
  @Input('relativePlayerXPos') relativePlayerXPos: number = 0;

  public eyesDirection = 0;
}
