import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-panel-torch',
  standalone: true,
  imports: [],
  templateUrl: './svg-panel-torch.component.html',
  styleUrl: './svg-panel-torch.component.css',
})
export class SvgPanelTorchComponent {
  @Input('isPanelSelected') isPanelSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
