import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input('label') label: string = 'Click';
  // Supported variants: contained, outlined
  @Input('fullWidth') fullWidth: boolean = false;
  @Input('variant') variant: string = 'contained';
  @Input('icon') icon: string | null = null;
  @Input('isDisabled') isDisabled: boolean = false;
  @Output() onButtonClick = new EventEmitter<string>();

  public handleButtonClick(): void {
    this.onButtonClick.emit();
  }
}
