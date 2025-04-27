import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-player',
  standalone: true,
  imports: [],
  templateUrl: './svg-player.component.html',
  styleUrl: './svg-player.component.css',
})
export class SvgPlayerComponent {
  @Input('playerFacing') playerFacing: string = 'north';
  // @Input('playerAction') playerAction: string = 'n';
}
