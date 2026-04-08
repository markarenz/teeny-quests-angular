import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-svg-exit-cave-s',
  imports: [],
  templateUrl: './svg-exit-cave-s.component.html',
  styleUrl: './svg-exit-cave-s.component.css',
})
export class SvgExitCaveSComponent {
  @Input('isEditorSelected') isEditorSelected: boolean = false;
  @Input('isClickable') isClickable: boolean = false;
  @Input('isLevelExit') isLevelExit: boolean = false;
  @Input('lock') lock = 'gold';
  @Output() onClick = new EventEmitter<string>();

  handleClick() {
    if (this.isClickable) {
      this.onClick.emit('click');
    }
  }
}
