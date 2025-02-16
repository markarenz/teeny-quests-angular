import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-mini-logo',
  standalone: true,
  imports: [],
  templateUrl: './svg-mini-logo.component.html',
  styleUrl: './svg-mini-logo.component.css',
})
export class SvgMiniLogoComponent {
  @Input('theme') theme: string = 'color';
}
