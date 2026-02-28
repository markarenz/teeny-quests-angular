import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-prop-gem-frame-sapphire',
  standalone: true,
  imports: [],
  templateUrl: './svg-prop-gem-frame-sapphire.component.html',
  styleUrl: './svg-prop-gem-frame-sapphire.component.css',
})
export class SvgPropGemFrameSapphireComponent {
  @Input('isPropSelected') isPropSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('flipH') flipH = false;
  @Input('status') status = 'off';
}
