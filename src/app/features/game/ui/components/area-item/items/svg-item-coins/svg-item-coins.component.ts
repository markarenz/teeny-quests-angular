import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-coins',
  imports: [],
  templateUrl: './svg-item-coins.component.html',
  styleUrl: './svg-item-coins.component.css',
  standalone: true,
})
export class SvgItemCoinsComponent {
  @Input('isFlat') isFlat: boolean = false;
}
