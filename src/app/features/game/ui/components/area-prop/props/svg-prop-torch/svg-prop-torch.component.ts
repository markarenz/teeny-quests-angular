import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-prop-torch',
  imports: [],
  templateUrl: './svg-prop-torch.component.html',
  styleUrl: './svg-prop-torch.component.css',
  standalone: true,
})
export class SvgPropTorchComponent {
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
