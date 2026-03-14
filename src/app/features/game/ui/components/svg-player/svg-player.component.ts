import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-player',
  imports: [],
  templateUrl: './svg-player.component.html',
  styleUrl: './svg-player.component.css',
  standalone: true,
})
export class SvgPlayerComponent {
  @Input('playerFacing') playerFacing: string = 'north';
  @Input('playerAnim') playerAnim: string = '';
}
