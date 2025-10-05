import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-prop-switch',
  standalone: true,
  imports: [],
  templateUrl: './svg-prop-switch.component.html',
  styleUrl: './svg-prop-switch.component.css',
})
export class SvgPropSwitchComponent {
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
