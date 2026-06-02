import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-actor-shop',
  imports: [],
  templateUrl: './svg-actor-shop.component.html',
  styleUrl: './svg-actor-shop.component.css',
})
export class SvgActorShopComponent {
  @Input('isActorSelected') isActorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('relativePlayerXPos') relativePlayerXPos: number = 0;
  @Input('isKing') isKing: boolean = false;
  public eyesDirection = 0;
}
