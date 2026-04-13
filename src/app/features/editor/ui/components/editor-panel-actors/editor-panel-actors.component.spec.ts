import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorPanelActorsComponent } from './editor-panel-actors.component';
import questMockData from '@app/features/editor/mocks/game.mock';
import { QuestActor } from '@app/features/main/interfaces/types';
import { ActorStatus, ActorType } from '@app/features/main/interfaces/enums';

let gameMock = structuredClone(questMockData);
let service: GameEditorService;

const mockActor: QuestActor = {
  id: 'actor-1',
  name: 'Test Actor',
  actorType: ActorType.SLIME_GREEN,
  actorStatus: ActorStatus.IDLE,
  x: 1,
  y: 2,
  h: 1,
  areaId: 'start',
  health: 5,
};

describe('EditorPanelActorsComponent', () => {
  let component: EditorPanelActorsComponent;
  let fixture: ComponentFixture<EditorPanelActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelActorsComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMock);
    service.setSelectedAreaId('start');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle create click', () => {
    component.actors = [];
    spyOn(service, 'createActor').and.returnValue(mockActor);
    component.handleCreateClick();
    fixture.detectChanges();
    expect(service.createActor).toHaveBeenCalled();
  });

  it('should handle delete click', () => {
    component.actors = [mockActor];
    spyOn(service, 'deleteActor').and.callFake(() => mockActor);
    spyOn(service, 'getActorsForCurrentArea').and.returnValue([]);
    component.handleDeleteClick('actor-1');
    fixture.detectChanges();
    expect(service.deleteActor).toHaveBeenCalled();
    expect(service.getActorsForCurrentArea).toHaveBeenCalled();
  });
});
