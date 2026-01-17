import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorPanelEventsComponent } from './editor-panel-events.component';
import {
  ActionEffect,
  GameEventActionCondition,
} from '@app/features/main/interfaces/types';
import {
  ConditionComparison,
  EventAction,
  EventConditionType,
} from '@app/features/main/interfaces/enums';

const mockActions: ActionEffect[] = [
  {
    id: 'action-1',
    action: EventAction.UPDATE_MAP_CELL_HEIGHT,
    actionObject: {
      areaId: 'start',
      identifier: '0,0',
    },
    actionValue: 10,
  },
];

const mockConditions: GameEventActionCondition[] = [
  {
    id: 'condition-1',
    conditionType: EventConditionType.INVENTORY,
    identifier: 'gold',
    comparison: ConditionComparison.GREATER_THAN,
    value: 100,
  },
];

describe('EditorPanelEventsComponent', () => {
  let component: EditorPanelEventsComponent;
  let fixture: ComponentFixture<EditorPanelEventsComponent>;
  let service: GameEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelEventsComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });

  it('should handle create', () => {
    spyOn(service, 'createEvent');
    component.handleCreateClick();
    expect(service.createEvent).toHaveBeenCalled();
  });
  it('should handle edit', () => {
    component.events = [
      {
        id: 'event-1',
        name: 'Event 1',
        conditions: [],
        actions: [],
        isUnidirectional: true,
      },
    ];
    spyOn(service, 'selectEvent');
    component.handleEditClick('event-1');
    expect(service.selectEvent).toHaveBeenCalledWith('event-1');
  });
  it('should handle edit - deselect', () => {
    component.selectedEventId = 'event-1';
    component.events = [
      {
        id: 'event-1',
        name: 'Event 1',
        conditions: [],
        actions: [],
        isUnidirectional: true,
      },
    ];
    spyOn(service, 'selectEvent');
    component.handleEditClick('event-1');
    // Deselected event
    expect(service.selectEvent).toHaveBeenCalledWith('');
  });
  it('should handle delete', () => {
    component.events = [
      {
        id: 'event-1',
        name: 'Event 1',
        conditions: [],
        actions: [],
        isUnidirectional: true,
      },
    ];
    spyOn(service, 'deleteEvent');
    component.handleDeleteClick('event-1');
    expect(service.deleteEvent).toHaveBeenCalled();
  });

  it('should handle input change', () => {
    component.selectedEventId = 'event-1';
    component.selectedEvent = {
      id: 'event-1',
      name: 'Old Name',
      conditions: [],
      actions: [],
      isUnidirectional: false,
    };
    component.inputEventName = 'New Name';
    spyOn(service, 'updateEventData');
    component.handleEventInputChange();
    expect(service.updateEventData).toHaveBeenCalledWith('event-1', {
      name: 'New Name',
      actions: [],
      conditions: [],
      isUnidirectional: false,
    });
  });
  it('should handle input change - no selected event', () => {
    component.selectedEventId = '';
    component.selectedEvent = null;
    component.inputEventName = 'New Name';
    spyOn(service, 'updateEventData');
    component.handleEventInputChange();
    expect(service.updateEventData).not.toHaveBeenCalled();
  });
  it('should update UI after event selection', () => {
    component.events = [
      {
        id: 'event-1',
        name: 'Event 1',
        conditions: [],
        actions: [],
        isUnidirectional: true,
      },
    ];
    component.updateUiAfterEventSelection('event-1');
    expect(component.selectedEventId).toBe('event-1');
    expect(component.selectedEvent).toEqual(component.events[0]);
    expect(component.inputEventName).toBe('Event 1');
    expect(component.inputEventIsUnidirectional).toBe(true);
  });

  it('should handle action input change', () => {
    component.selectedEventId = 'event-1';
    component.selectedEvent = {
      id: 'event-1',
      name: 'Event 1',
      conditions: [],
      actions: [],
      isUnidirectional: false,
    };
    spyOn(component, 'handleEventInputChange');
    component.handleEventActionInputChange(mockActions);
    expect(component.selectedEvent?.actions).toBe(mockActions);
    expect(component.handleEventInputChange).toHaveBeenCalled();
  });
  it('should ignore action input change when no action selected', () => {
    component.selectedEventId = '';
    spyOn(component, 'handleEventInputChange');
    component.handleEventActionInputChange(mockActions);
    expect(component.selectedEvent?.actions).not.toBe(mockActions);
    expect(component.handleEventInputChange).not.toHaveBeenCalled();
  });

  it('should handle condition input change', () => {
    component.selectedEventId = 'event-1';
    component.selectedEvent = {
      id: 'event-1',
      name: 'Event 1',
      conditions: [],
      actions: [],
      isUnidirectional: false,
    };
    spyOn(component, 'handleEventInputChange');
    component.handleEventConditionInputChange(mockConditions);
    expect(component.selectedEvent?.conditions).toBe(mockConditions);
    expect(component.handleEventInputChange).toHaveBeenCalled();
  });

  it('should ignore condition input change when no action is selected', () => {
    component.selectedEventId = '';
    component.selectedEvent = {
      id: 'event-1',
      name: 'Event 1',
      conditions: [],
      actions: [],
      isUnidirectional: false,
    };
    spyOn(component, 'handleEventInputChange');
    component.handleEventConditionInputChange(mockConditions);
    expect(component.selectedEvent?.conditions).not.toBe(mockConditions);
    expect(component.handleEventInputChange).not.toHaveBeenCalled();
  });
});
