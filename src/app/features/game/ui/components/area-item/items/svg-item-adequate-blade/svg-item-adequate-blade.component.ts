import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-adequate-blade',
  imports: [],
  templateUrl: './svg-item-adequate-blade.component.html',
  styleUrl: './svg-item-adequate-blade.component.css',
})
export class SvgItemAdequateBladeComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
