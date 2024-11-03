import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-bg',
  standalone: true,
  imports: [],
  templateUrl: './modal-bg.component.html',
  styleUrl: './modal-bg.component.css',
})
export class ModalBgComponent {
  @Output() onBgClick = new EventEmitter<string>();

  public handleBGClick(): void {
    this.onBgClick.emit();
  }
}
