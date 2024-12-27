import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-close',
  standalone: true,
  imports: [],
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.css',
})
export class ButtonCloseComponent {
  @Output() onButtonClick = new EventEmitter<string>();

  public handleButtonClick(): void {
    this.onButtonClick.emit();
  }
}
