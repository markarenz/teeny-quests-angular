import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-ring-protection',
  imports: [],
  templateUrl: './svg-item-ring-protection.component.html',
  styleUrl: './svg-item-ring-protection.component.css',
})
export class SvgItemRingProtectionComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
