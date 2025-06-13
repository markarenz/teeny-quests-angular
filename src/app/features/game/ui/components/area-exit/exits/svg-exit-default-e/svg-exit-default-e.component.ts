import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-exit-default-e',
  standalone: true,
  imports: [],
  templateUrl: './svg-exit-default-e.component.html',
  styleUrl: './svg-exit-default-e.component.css',
})
export class SvgExitDefaultEComponent {
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('lock') lock = 'gold'; // TODO: remove this
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    if (this.isClickable) {
      this.onClick.emit('click');
    }
  }
}
