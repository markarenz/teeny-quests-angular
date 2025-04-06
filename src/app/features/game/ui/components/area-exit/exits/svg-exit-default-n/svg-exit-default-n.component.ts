import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-exit-default-n',
  standalone: true,
  imports: [],
  templateUrl: './svg-exit-default-n.component.html',
  styleUrl: './svg-exit-default-n.component.css',
})
export class SvgExitDefaultNComponent {
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    if (this.isClickable) {
      this.onClick.emit('click');
    }
  }
}
