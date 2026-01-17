import { Component, input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionEffect, GameEvent } from '@app/features/main/interfaces/types';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { IconButtonComponent } from '@app/features/main/ui/components/icons/icon-button/icon-button.component';
import { FormsModule } from '@angular/forms';
import { EditorInputActionsComponent } from '../editor-input-actions/editor-input-actions.component';
import { EditorInputConditionsComponent } from '../editor-input-conditions/editor-input-conditions.component';

@Component({
  selector: 'app-editor-panel-events',
  standalone: true,
  imports: [
    FormsModule,
    CollapsibleCardComponent,
    IconButtonComponent,
    EditorInputActionsComponent,
    EditorInputConditionsComponent,
  ],
  templateUrl: './editor-panel-events.component.html',
  styleUrl: './editor-panel-events.component.css',
})
export class EditorPanelEventsComponent {
  constructor(private _gameEditorService: GameEditorService) {}
  private subscriptions: Subscription[] = [];
  public events: GameEvent[] = [];
  public selectedEventId: string | null = null;
  public inputEventName: string = '';
  public inputEventIsUnidirectional: boolean = false;
  public selectedEvent: GameEvent | null = null;

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
    this.selectedEventId = null;
    this.selectedEvent = null;
  }

  public handleEditClick(eventId: string) {
    if (this.selectedEventId === eventId) {
      this._gameEditorService.selectEvent('');
      this.selectedEventId = '';
      return;
    }
    this._gameEditorService.selectEvent(eventId);
    this.updateUiAfterEventSelection(eventId);
  }

  public updateUiAfterEventSelection(id: string) {
    this.selectedEventId = id;
    this.selectedEvent = this.events.find(event => event.id === id) || null;
    this.inputEventName = this.selectedEvent ? this.selectedEvent.name : '';
    this.inputEventIsUnidirectional =
      this.selectedEvent?.isUnidirectional || false;
  }
  public handleEventInputChange() {
    if (!this.selectedEventId || !this.selectedEvent) return;

    this._gameEditorService.updateEventData(this.selectedEventId, {
      name: this.inputEventName,
      actions: this.selectedEvent.actions ?? [],
      conditions: this.selectedEvent.conditions ?? [],
      isUnidirectional: this.inputEventIsUnidirectional,
    });
  }
  public handleEventActionInputChange(actions: ActionEffect[]) {
    if (!this.selectedEventId || !this.selectedEvent) return;
    this.selectedEvent.actions = actions;
    this.handleEventInputChange();
  }

  public handleEventConditionInputChange(conditions: GameEvent['conditions']) {
    if (!this.selectedEventId || !this.selectedEvent) return;
    this.selectedEvent.conditions = conditions;
    this.handleEventInputChange();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
