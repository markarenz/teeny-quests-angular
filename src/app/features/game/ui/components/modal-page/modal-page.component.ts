import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModalComponent } from '@app/features/main/ui/components/common-modal/common-modal.component';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { ContentGameHelpComponent } from '../content-game-help/content-game-help.component';
import { Paragraph } from '@app/features/main/interfaces/types';
@Component({
  selector: 'app-modal-page',
  standalone: true,
  imports: [
    CommonModalComponent,
    LoaderAnimationComponent,
    ContentGameHelpComponent,
  ],
  templateUrl: './modal-page.component.html',
  styleUrl: './modal-page.component.css',
})
export class ModalPageComponent {
  @Input('levelGoals') levelGoals: string = '';
  @Input('title') title: string = '';
  @Input('gameModalStatus') gameModalStatus: string = 'loading';
  @Input('isLoading') isLoading: boolean = false;

  @Output() onClose = new EventEmitter();
  @Output() onConfirm = new EventEmitter();

  handleConfirmClick() {
    this.onConfirm.emit();
  }

  handleCloseClick() {
    if (this.onClose) {
      this.onClose.emit();
    }
  }
}
