import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-sapphire',
  imports: [SvgShadowComponent],
  templateUrl: './svg-item-sapphire.component.html',
  styleUrl: './svg-item-sapphire.component.css',
  standalone: true,
})
export class SvgItemSapphireComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
