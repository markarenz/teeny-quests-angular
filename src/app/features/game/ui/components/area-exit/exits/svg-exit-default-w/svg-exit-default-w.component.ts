import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-exit-default-w',
  standalone: true,
  imports: [],
  templateUrl: './svg-exit-default-w.component.html',
  styleUrl: './svg-exit-default-w.component.css',
})
export class SvgExitDefaultWComponent {
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('lock') lock = 'silver'; // TODO: remove this
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    if (this.isClickable) {
      this.onClick.emit('click');
    }
  }
}
