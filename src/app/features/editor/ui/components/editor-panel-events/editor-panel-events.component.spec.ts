import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorPanelEventsComponent } from './editor-panel-events.component';

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
  it('should handle delete', () => {
    component.events = [
      { id: 'event-1', name: 'Event 1', conditions: [], actions: [] },
    ];
    spyOn(service, 'deleteEvent');
    component.handleDeleteClick('event-1');
    expect(service.deleteEvent).toHaveBeenCalled();
  });
});
