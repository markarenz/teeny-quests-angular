import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameROM, SelectIUIOption } from '@app/features/main/interfaces/types';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-area-selector-general',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editor-area-selector-general.component.html',
  styleUrl: './editor-area-selector-general.component.css',
})
export class EditorAreaSelectorGeneralComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  selectedArealocal: string = '';
  areasList: string[] = [];
  areasListOptions: SelectIUIOption[] = [];

  @Input('areaId') areaId: string = 'start';
  @Output() onAreaSelected = new EventEmitter<string>();

  ngOnInit() {
    this.selectedArealocal = this.areaId;
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        const game = data;
        this.areasList = game ? Object.keys(game.content.areas) : [];
        this.areasListOptions = this._gameEditorService.getAreasListOptions();
      })
    );
  }

  ngOnChanges() {
    this.selectedArealocal = this.areaId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleSelectedAreaChange() {
    this.onAreaSelected.emit(this.selectedArealocal);
  }
}
