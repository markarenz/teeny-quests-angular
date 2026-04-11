import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
  standalone: true,
})
export class TooltipComponent {
  @Input('content') content: string = '';
  @Input('align') align: string = 'center';
  @Input('position') position: string = 'top';
  @Input('fullWidth') fullWidth: boolean = false;
}
