import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorPanelActorsComponent } from './editor-panel-actors.component';
import questMockData from '@app/features/editor/mocks/game.mock';
import {
  ActionEffect,
  QuestActor,
  QuestArea,
} from '@app/features/main/interfaces/types';
import { EventAction } from '@app/features/main/interfaces/enums';
import { mockActor } from '@app/features/editor/mocks/actor.mock';

let gameMock = structuredClone(questMockData);
let service: GameEditorService;

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
    component.ngOnInit();
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

  it('should handle area ID change', () => {
    component.selectedAreaId = 'init';
    spyOn(service, 'getAreaById').and.returnValue(
      gameMock.content.areas['start']
    );
    spyOn(service, 'getActorsForCurrentArea').and.returnValue([]);
    spyOn(service, 'getSelectedAreaId').and.returnValue('other-area');
    component.ngOnInit();
    fixture.detectChanges();
    expect(service.getActorsForCurrentArea).toHaveBeenCalled();
  });
  it('should handle area change with no actors', () => {
    component.selectedAreaId = 'init';
    const mockArea: QuestArea = gameMock.content.areas['start'];

    spyOn(service, 'getAreaById').and.returnValue({
      ...mockArea,
      //@ts-expect-error test missing actors
      actors: undefined,
    });
    spyOn(service, 'getActorsForCurrentArea').and.returnValue([]);
    spyOn(service, 'getSelectedAreaId').and.returnValue('other-area');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.actors.length).toEqual(0);
    expect(service.getActorsForCurrentArea).toHaveBeenCalled();
  });

  it('should handle area change with actors', () => {
    component.selectedAreaId = 'init';
    const mockArea: QuestArea = gameMock.content.areas['start'];

    spyOn(service, 'getAreaById').and.returnValue({
      ...mockArea,
    });
    spyOn(service, 'getActorsForCurrentArea').and.returnValue([mockActor]);
    spyOn(service, 'getSelectedAreaId').and.returnValue('other-area');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.actors.length).toEqual(1);
    expect(service.getActorsForCurrentArea).toHaveBeenCalled();
  });

  // test component.handleActorActionInputChange
  it('should handle actor action input change', () => {
    const mockAction: ActionEffect = {
      id: '12345',
      action: EventAction.UPDATE_MAP_CELL_HEIGHT,
      actionObject: {
        areaId: 'start',
        identifier: '1_2',
        subIdentifier: 'floor',
      },
      actionValue: 2,
    };
    component.selectedActorId = mockActor.id;
    component.actors = [mockActor];
    const updatedActor = {
      ...mockActor,
      actions: [mockAction],
    };
    spyOn(service, 'updateActor').and.callFake(() => updatedActor);
    component.handleActorActionInputChange([mockAction]);
    fixture.detectChanges();
    expect(service.updateActor).toHaveBeenCalled();
  });
  it('should handle position select', () => {
    component.selectedActorId = mockActor.id;
    component.actors = [mockActor];
    const updatedActor = {
      ...mockActor,
      x: 3,
      y: 4,
    };
    spyOn(service, 'updateActor').and.callFake(() => updatedActor);
    component.handlePositionSelect('4_3');
    fixture.detectChanges();
    expect(service.updateActor).toHaveBeenCalled();
  });
});
