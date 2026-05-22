import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-pointy-stick',
  imports: [],
  templateUrl: './svg-item-pointy-stick.component.html',
  styleUrl: './svg-item-pointy-stick.component.css',
  standalone: true,
})
export class SvgItemPointyStickComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
