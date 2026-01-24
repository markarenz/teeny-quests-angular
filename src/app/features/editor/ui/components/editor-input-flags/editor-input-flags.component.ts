import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameFlag } from '@app/features/main/interfaces/types';
import { logger } from '@app/features/main/utils/logger';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-input-flags',
  standalone: true,
  imports: [CollapsibleCardComponent, IconButtonComponent, FormsModule],
  templateUrl: './editor-input-flags.component.html',
  styleUrl: './editor-input-flags.component.css',
})
export class EditorInputFlagsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];

  public inputScoreValue: number = 0;
  public inputName: string = '';
  public selectedFlagId: string = '';
  public selectedFlag: GameFlag | null = null;
  public flags: GameFlag[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.flagsObs.subscribe((data: GameFlag[] | null) => {
        if (data) {
          this.flags = data;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleInputChange() {
    const newFlag: GameFlag = {
      id: this.selectedFlag?.id || '',
      name: this.inputName,
      scoreValue: this.inputScoreValue,
    };
    this._gameEditorService.updateFlag(newFlag);
  }
  handleCreateClick() {
    this._gameEditorService.createFlag();
  }
  handleDeleteClick(flagId: string) {
    this.selectedFlagId = '';
    this.selectedFlag = null;
    this._gameEditorService.deleteFlag(flagId);
  }

  handleEditClick(flagId: string) {
    if (this.selectedFlagId === flagId) {
      this.selectedFlagId = '';
      this.selectedFlag = null;
      return;
    }
    this.selectedFlagId = flagId;
    this.selectedFlag = this.flags.find(flag => flag.id === flagId) || null;
    if (!this.selectedFlag) {
      this.selectedFlagId = '';
      logger({ type: 'warn', message: `Flag with ID ${flagId} not found.` });
    }
    this.inputName = this.selectedFlag?.name || '';
    this.inputScoreValue = this.selectedFlag?.scoreValue || 0;
  }
}
