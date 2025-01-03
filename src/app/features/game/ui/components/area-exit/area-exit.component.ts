import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameAreaExit } from '@app/features/main/interfaces/types';
import { defaultExit } from '@app/features/game/lib/constants';

@Component({
  selector: 'app-area-exit',
  standalone: true,
  imports: [],
  templateUrl: './area-exit.component.html',
  styleUrl: './area-exit.component.css',
})
export class AreaExitComponent {
  @Input('exit') exit: GameAreaExit = defaultExit;
  left: string = '';
  bottom: string = '';

  // subscribe to ? and update height on change
  // determine height of exit, set left, bottom
  // exits same size as cells but can be taller - position left bottom
  // onClick to select exit for editor and travel for game
}
