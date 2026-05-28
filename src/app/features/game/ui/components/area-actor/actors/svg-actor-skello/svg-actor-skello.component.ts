import { Component, Input } from '@angular/core';
import { AnimStatus } from '@app/features/main/interfaces/enums';

@Component({
  selector: 'app-svg-actor-skello',
  imports: [],
  templateUrl: './svg-actor-skello.component.html',
  styleUrl: './svg-actor-skello.component.css',
})
export class SvgActorSkelloComponent {
  @Input('isActorSelected') isActorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('status') status: AnimStatus = AnimStatus.IDLE;
  @Input('relativePlayerXPos') relativePlayerXPos: number = 0;

  public eyesDirection = 0;
}
