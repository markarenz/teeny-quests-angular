import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalBgComponent } from '@main/ui/components/modal-bg/modal-bg.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';

@Component({
  selector: 'app-common-modal',
  standalone: true,
  imports: [ModalBgComponent, ButtonComponent],
  templateUrl: './common-modal.component.html',
  styleUrl: './common-modal.component.css',
})
export class CommonModalComponent {
  @Input('title') title: string = '';
  @Input('content') content: string = '';
  @Input('showCancel') showCancel: boolean = false;
  @Output() onClose = new EventEmitter();
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel? = new EventEmitter();

  handleConfirmClick() {
    this.onConfirm.emit();
  }
  handleCloseClick() {
    this.onClose.emit();
  }
  handleCancelClick() {
    if (this.onCancel) {
      this.onCancel.emit();
    }
  }
}
