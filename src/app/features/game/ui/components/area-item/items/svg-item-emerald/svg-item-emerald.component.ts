import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-emerald',
  standalone: true,
  imports: [SvgShadowComponent],
  templateUrl: './svg-item-emerald.component.html',
  styleUrl: './svg-item-emerald.component.css',
})
export class SvgItemEmeraldComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
