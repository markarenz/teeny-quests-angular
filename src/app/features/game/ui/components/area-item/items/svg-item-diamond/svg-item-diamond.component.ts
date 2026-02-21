import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-diamond',
  standalone: true,
  imports: [SvgShadowComponent],
  templateUrl: './svg-item-diamond.component.html',
  styleUrl: './svg-item-diamond.component.css',
})
export class SvgItemDiamondComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
