import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { Game } from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-editor-area-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editor-area-selector.component.html',
  styleUrl: './editor-area-selector.component.css',
})
export class EditorAreaSelectorComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];
  selectedArealocal: string = '';
  areasList: string[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: Game | null) => {
        const game = data;
        this.areasList = game ? Object.keys(game.content.areas) : [];
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: string) => {
        this.selectedArealocal = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // subscribe to selectedArea
  // subscribe to game to get area list
  // fire to service when selected area changes

  handleSelectedAreaChange() {
    this._gameEditorService.setSelectedAreaId(this.selectedArealocal);
  }
}
