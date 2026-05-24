import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-health-potion',
  templateUrl: './svg-item-health-potion.component.html',
  styleUrl: './svg-item-health-potion.component.css',
  imports: [SvgShadowComponent],
  standalone: true,
})
export class SvgItemHealthPotionComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
