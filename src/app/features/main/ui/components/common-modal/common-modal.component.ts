import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
  @Input('isLockedOut') isLockedOut: boolean = false;
  @Output() onClose = new EventEmitter();
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel? = new EventEmitter();
  @ViewChild('elementRefHeader') elementRefHeader!: ElementRef;
  @ViewChild('elementRefFooter') elementRefFooter!: ElementRef;
  @ViewChild('elementRefContent') elementRefContent!: ElementRef;

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
  ngAfterViewInit() {
    const h1 = this.elementRefHeader.nativeElement.offsetHeight;
    const h2 = this.elementRefFooter.nativeElement.offsetHeight;
    const commonModalHeaderFooterHeight = h1 + h2 + 20;
    this.elementRefContent.nativeElement.style.setProperty(
      'max-height',
      `calc(100vh - ${commonModalHeaderFooterHeight}px)`
    );
  }
}
