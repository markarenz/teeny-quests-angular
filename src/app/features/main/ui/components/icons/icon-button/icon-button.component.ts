import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css',
})
export class IconButtonComponent {
  // Icons supported: Edit, Close, New, Info, Help
  @Input('label') label: string = 'Click';
  @Input('theme') theme: string = 'default';
  @Input('icon') icon: string = 'edit';
  @Input('size') size: string = 'sm';
  @Input('showDot') showDot?: boolean = false;
  @Input('isDisabled') isDisabled: boolean = false;
  @Output() onButtonClick = new EventEmitter<string>();

  public handleButtonClick(): void {
    this.onButtonClick.emit();
  }
}
