import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-prop-gem-frame-diamond',
  standalone: true,
  imports: [],
  templateUrl: './svg-prop-gem-frame-diamond.component.html',
  styleUrl: './svg-prop-gem-frame-diamond.component.css',
})
export class SvgPropGemFrameDiamondComponent {
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
