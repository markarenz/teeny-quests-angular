import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-coins',
  standalone: true,
  imports: [],
  templateUrl: './svg-item-coins.component.html',
  styleUrl: './svg-item-coins.component.css',
})
export class SvgItemCoinsComponent {
  @Input('isFlat') isFlat: boolean = false;
}
