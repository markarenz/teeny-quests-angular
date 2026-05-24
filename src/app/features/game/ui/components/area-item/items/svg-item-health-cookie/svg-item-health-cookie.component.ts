import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-health-cookie',
  templateUrl: './svg-item-health-cookie.component.html',
  styleUrl: './svg-item-health-cookie.component.css',
  imports: [SvgShadowComponent],
  standalone: true,
})
export class SvgItemHealthCookieComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
