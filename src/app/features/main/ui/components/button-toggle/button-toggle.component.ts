import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-toggle',
  imports: [],
  templateUrl: './button-toggle.component.html',
  styleUrl: './button-toggle.component.css',
})
export class ButtonToggleComponent {
  @Input() optionA: string = 'A';
  @Input() optionB: string = 'B';
  @Input() selected: string = '';
  @Output() selectedChange = new EventEmitter<string>();

  onOptionClick(option: string) {
    this.selected = option.toLowerCase();
    this.selectedChange.emit(this.selected);
  }
}
