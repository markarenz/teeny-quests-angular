import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input('label') label: string = 'Click';
  @Input('enableSound') enableSound: boolean = true;
  // Supported variants: contained, outlined
  @Input('fullWidth') fullWidth: boolean = false;
  @Input('variant') variant: string = 'contained';
  @Input('icon') icon: string | null = null;
  @Input('isDisabled') isDisabled: boolean = false;
  @Output() onButtonClick = new EventEmitter<string>();

  constructor(private _audioService: AudioService) {}

  public handleButtonClick(): void {
    if (!this.isDisabled) {
      this.onButtonClick.emit();
    }
  }
  public handleMouseDown(): void {
    if (this.enableSound) {
      this._audioService.playSound('click1');
    }
  }
}
