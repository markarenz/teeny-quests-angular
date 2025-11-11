import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-prop-banner',
  standalone: true,
  imports: [],
  templateUrl: './svg-prop-banner.component.html',
  styleUrl: './svg-prop-banner.component.css',
})
export class SvgPropBannerComponent {
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
  @Input('isTouched') isTouched: boolean = false;
}
