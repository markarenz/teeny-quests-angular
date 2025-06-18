import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameROM, SelectIUIOption } from '@app/features/main/interfaces/types';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-area-selector',
  standalone: true,
  imports: [FormsModule, IconButtonComponent],
  templateUrl: './editor-area-selector.component.html',
  styleUrl: './editor-area-selector.component.css',
})
export class EditorAreaSelectorComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  selectedAreaLocal: string = '';
  inputAreaRename: string = '';
  areasList: string[] = [];
  areasListOptions: SelectIUIOption[] = [];
  uiMode: string = 'select';

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.gameObs.subscribe((data: GameROM | null) => {
        const game = data;
        this.areasList = game ? Object.keys(game.content.areas) : [];
        this.areasListOptions =
          this._gameEditorService.getDestinationAreasListOptions();
      })
    );
    this.subscriptions.push(
      this._gameEditorService.selectedAreaIdObs.subscribe((data: string) => {
        this.selectedAreaLocal = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleSelectedAreaChange() {
    this._gameEditorService.setSelectedAreaId(this.selectedAreaLocal);
  }

  handleRenameClick() {
    const selectedOption = this.areasListOptions.find(
      (option) => option.value === this.selectedAreaLocal
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
