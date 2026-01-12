import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameEvent } from '@app/features/main/interfaces/types';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';

@Component({
  selector: 'app-editor-panel-events',
  standalone: true,
  imports: [CollapsibleCardComponent, IconButtonComponent],
  templateUrl: './editor-panel-events.component.html',
  styleUrl: './editor-panel-events.component.css',
})
export class EditorPanelEventsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  public events: GameEvent[] = [];
  public selectedEventId: string | null = null;

  ngOnInit() {
    this.events = this._gameEditorService.getEvents();
    this.subscriptions.push(
      this._gameEditorService.eventsObs.subscribe((data: GameEvent[]) => {
        this.events = data;
      })
    );
  }
  public handleCreateClick() {
    this._gameEditorService.createEvent();
  }

  public handleDeleteClick(eventId: string) {
    this._gameEditorService.deleteEvent(eventId);
  }

  public handleEditClick(eventId: string) {
    // TBD
  }
}
