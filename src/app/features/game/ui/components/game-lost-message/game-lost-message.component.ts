import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModalComponent } from '@app/features/main/ui/components/common-modal/common-modal.component';
@Component({
  selector: 'app-game-lost-message',
  imports: [CommonModalComponent],
  templateUrl: './game-lost-message.component.html',
  styleUrl: './game-lost-message.component.css',
})
export class GameLostMessageComponent {
  @Output() handleGameEndConfirmClick = new EventEmitter<void>();
  @Output() handleTryAgainClick = new EventEmitter<void>();

  public handleCancelClick(): void {
    this.handleGameEndConfirmClick.emit();
  }

  public handleConfirmClick(): void {
    this.handleTryAgainClick.emit();
  }
}
