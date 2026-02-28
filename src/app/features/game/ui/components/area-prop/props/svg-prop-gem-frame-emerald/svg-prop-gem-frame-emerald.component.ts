import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-prop-gem-frame-emerald',
  standalone: true,
  imports: [],
  templateUrl: './svg-prop-gem-frame-emerald.component.html',
  styleUrl: './svg-prop-gem-frame-emerald.component.css',
})
export class SvgPropGemFrameEmeraldComponent {
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
