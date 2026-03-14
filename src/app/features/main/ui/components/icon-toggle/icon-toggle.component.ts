import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';
@Component({
  selector: 'app-icon-toggle',
  imports: [TooltipComponent],
  templateUrl: './icon-toggle.component.html',
  styleUrl: './icon-toggle.component.css',
  standalone: true,
})
export class IconToggleComponent {
  @Input() iconSet: string = 'single-multi';
  @Input() tooltipContent: string = '';
  @Input() toggleState: boolean = false;
  @Output() onToggleChange = new EventEmitter<boolean>();

  handleToggle() {
    this.toggleState = !this.toggleState;
    this.onToggleChange.emit(this.toggleState);
  }
}
