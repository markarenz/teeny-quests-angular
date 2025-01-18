import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameAreaExit } from '@app/features/main/interfaces/types';
import { defaultExit } from '@app/features/game/lib/constants';
import { defaultGridSize } from '@config/index';
import {
  AreaPosition,
  getAreaItemPositionStyle,
} from '@app/features/game/lib/utils/index';
import { SvgExitDefaultWComponent } from './exits/svg-exit-default-w/svg-exit-default-w.component';
import { SvgExitDefaultNComponent } from './exits/svg-exit-default-n/svg-exit-default-n.component';
import { SvgExitDefaultSComponent } from './exits/svg-exit-default-s/svg-exit-default-s.component';
import { SvgExitDefaultEComponent } from './exits/svg-exit-default-e/svg-exit-default-e.component';

@Component({
  selector: 'app-area-exit',
  standalone: true,
  imports: [
    SvgExitDefaultWComponent,
    SvgExitDefaultNComponent,
    SvgExitDefaultSComponent,
    SvgExitDefaultEComponent,
  ],
  templateUrl: './area-exit.component.html',
  styleUrl: './area-exit.component.css',
})
export class AreaExitComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  @Input('exit') exit: GameAreaExit = defaultExit;
  private subscriptions: Subscription[] = [];

  gridSize: number = defaultGridSize;

  left: string = '';
  bottom: string = '';
  height: string = '0%';
  width: string = '0%';
  position: AreaPosition = { left: '0', bottom: '0', z: 0 };

  updateExitProps() {
    if (this.exit) {
      const { x, y, h } = this.exit;
      const cellW = 100 / this.gridSize;
      this.position = getAreaItemPositionStyle(this.gridSize, y, x, h);
      this.width = `${cellW}%`;
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.areaExitsObs.subscribe(
        (data: GameAreaExit[] | null) => {
          setTimeout(() => {
            this.updateExitProps();
          }, 10);
        }
      )
    );

    this.updateExitProps();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
