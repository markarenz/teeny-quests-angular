import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-sapphire',
  standalone: true,
  imports: [SvgShadowComponent],
  templateUrl: './svg-item-sapphire.component.html',
  styleUrl: './svg-item-sapphire.component.css',
})
export class SvgItemSapphireComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
