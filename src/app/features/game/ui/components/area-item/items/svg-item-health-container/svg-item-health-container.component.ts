import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-health-container',
  templateUrl: './svg-item-health-container.component.html',
  styleUrl: './svg-item-health-container.component.css',
  imports: [SvgShadowComponent],
  standalone: true,
})
export class SvgItemHealthContainerComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
