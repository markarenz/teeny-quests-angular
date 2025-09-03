import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-panel-switch',
  standalone: true,
  imports: [],
  templateUrl: './svg-panel-switch.component.html',
  styleUrl: './svg-panel-switch.component.css',
})
export class SvgPanelSwitchComponent {
  @Input('isPanelSelected') isPanelSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
