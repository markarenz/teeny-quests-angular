import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';

@Component({
  selector: 'app-game-end-message',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './game-end-message.component.html',
  styleUrl: './game-end-message.component.css',
})
export class GameEndMessageComponent {
  @Output() handleGameEndConfirmClick = new EventEmitter<void>();

  triggerGameEndConfirm = () => {
    this.handleGameEndConfirmClick.emit();
  };
}
