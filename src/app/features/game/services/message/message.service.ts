import { Injectable } from '@angular/core';
import { ToastMessage } from '@app/features/main/interfaces/types';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private toastr: ToastrService) {
    this.toastr = toastr;
  }

  public showMessage(toastMessage: ToastMessage): void {
    const { title: topic, message, messageType } = toastMessage;
    if (messageType === 'info' || !messageType) {
      this.toastr.info(message, topic);
    }
    if (messageType === 'success') {
      this.toastr.success(message, topic);
    }
    if (messageType === 'error') {
      this.toastr.error(message, topic);
    }
    if (messageType === 'warning') {
      this.toastr.warning(message, topic);
    }
  }
}
