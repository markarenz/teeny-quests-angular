import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorServiceService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameROM, SelectIUIOption } from '@app/features/main/interfaces/types';
import { IconButtonComponent } from '@app/features/main/ui/components/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-area-selector',
  standalone: true,
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './editor-area-selector.component.html',
  styleUrl: './editor-area-selector.component.css',
})
export class EditorAreaSelectorComponent {
  constructor(private _gameEditorService: GameEditorServiceService) {}
  private subscriptions: Subscription[] = [];
  selectedArealocal: string = '';
  inputAreaRename: string = '';
  areasList: string[] = [];
  areasListOptions: SelectIUIOption[] = [];
  uiMode: string = 'select';

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        const game = data;
        this.areasList = game ? Object.keys(game.content.areas) : [];
        this.areasListOptions = this._gameEditorService.getAreasListOptions();
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

  handleSelectedAreaChange() {
    this._gameEditorService.setSelectedAreaId(this.selectedArealocal);
  }

  handleRenameClick() {
    const selectedOption = this.areasListOptions.find(
      (option) => option.value === this.selectedArealocal
    );
    if (selectedOption) {
      this.inputAreaRename = selectedOption.label;
      this.uiMode = 'rename';
    }
  }

  handleRenameCancelClick() {
    this.uiMode = 'select';
  }

  handleRenameOkClick() {
    this._gameEditorService.renameCurrentSelectedArea(this.inputAreaRename);
    this.uiMode = 'select';
  }

  handleDeleteAreaClick() {
    if (confirm('Are you sure you want to delete this area?')) {
      this._gameEditorService.deleteCurrentSelectedArea();
    }
  }

  handleNewAreaClick() {
    this._gameEditorService.createArea();
  }
}
