import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-exit-default-s',
  standalone: true,
  imports: [],
  templateUrl: './svg-exit-default-s.component.html',
  styleUrl: './svg-exit-default-s.component.css',
})
export class SvgExitDefaultSComponent {
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
