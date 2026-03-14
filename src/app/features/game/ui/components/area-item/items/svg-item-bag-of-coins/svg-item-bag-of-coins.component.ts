import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-svg-item-bag-of-coins',
    imports: [],
    templateUrl: './svg-item-bag-of-coins.component.html',
    styleUrl: './svg-item-bag-of-coins.component.css'
})
export class SvgItemBagOfCoinsComponent {
  @Input('isFlat') isFlat: boolean = false;
}
