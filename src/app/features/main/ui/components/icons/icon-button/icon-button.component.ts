import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css',
})
export class IconButtonComponent {
  @Input('enableSound') enableSound: boolean = true;
  // Icons supported: Edit, Close, New, Info, Help
  @Input('label') label: string = 'Click';
  @Input('theme') theme: string = 'default';
  @Input('icon') icon: string = 'edit';
  @Input('size') size: string = 'sm';
  @Input('showDot') showDot?: boolean = false;
  @Input('isDisabled') isDisabled: boolean = false;
  @Output() onButtonClick = new EventEmitter<string>();

  constructor(private _audioService: AudioService) {}

  public handleButtonClick(): void {
    this.onButtonClick.emit();
  }

  public handleMouseDown(): void {
    if (this.enableSound) {
      this._audioService.playSound('click1');
    }
  }
}
