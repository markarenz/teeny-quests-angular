import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModalComponent } from '@app/features/main/ui/components/common-modal/common-modal.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import {
  ContentVersionListItem,
  TableField,
  TableAction,
} from '@app/features/main/interfaces/types';
import {
  IconButtonIconType,
  TableCellDisplayType,
} from '@app/features/main/interfaces/enums';
import { TableComponent } from '@app/features/main/ui/components/table/table.component';

@Component({
  selector: 'app-content-versions-modal',
  standalone: true,
  imports: [CommonModalComponent, ButtonComponent, TableComponent],
  templateUrl: './content-versions-modal.component.html',
  styleUrl: './content-versions-modal.component.css',
})
export class ContentVersionsModalComponent {
  private subscriptions: Subscription[] = [];
  public isLoading = true;
  public isSaving = false;
  public contentVersions: ContentVersionListItem[] = [];
  public contentVersionsTotal = 0;
  @Output() onCloseModal = new EventEmitter<void>();
  public handleModalClose = () => {
    this.onCloseModal.emit();
  };

  public tableActions: TableAction[] = [
    {
      label: 'Load',
      icon: IconButtonIconType.Use,
      theme: 'primary',
      onClick: (item: ContentVersionListItem) =>
        this.handleLoadVersion(item.id),
    },
    {
      label: 'Delete',
      icon: IconButtonIconType.Delete,
      theme: 'danger',
      onClick: (item: ContentVersionListItem) =>
        this.handleDeleteVersion(item.id),
    },
  ];

  public tableFields: TableField[] = [
    {
      label: 'Created',
      field: 'dateCreated',
      displayType: TableCellDisplayType.Date,
    },
    {
      label: 'Updated',
      field: 'dateUpdated',
      displayType: TableCellDisplayType.Date,
    },
    {
      label: 'Actions',
      field: '',
      displayType: TableCellDisplayType.Actions,
      actions: this.tableActions,
    },
  ];

  constructor(private _gameEditorService: GameEditorService) {}

  public handleSaveVersion = async () => {
    this.isSaving = true;
    await this._gameEditorService.createContentVersion();
    this.isSaving = false;
    this.isLoading = true;
    await this._gameEditorService.getContentVersionsForGame();
    this.isLoading = false;
  };
  public handleDeleteVersion = async (versionId: string) => {
    if (confirm('Are you sure you want to delete this version?')) {
      this.isLoading = true;
      await this._gameEditorService.deleteContentVersion(versionId);
      await this._gameEditorService.getContentVersionsForGame();
      this.isLoading = false;
    }
  };
  public handleLoadVersion = (versionId: string) => {
    this._gameEditorService.loadContentVersion(versionId);
    this.handleModalClose();
  };

  ngOnInit() {
    this.subscriptions.push(
      this._gameEditorService.contentVersionsObs.subscribe(
        (data: ContentVersionListItem[] | null) => {
          this.contentVersions = data || [];
          this.contentVersionsTotal = this.contentVersions.length;
          this.isLoading = false;
        }
      )
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
