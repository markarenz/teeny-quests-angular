import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import questMockData from '@app/features/editor/mocks/game.mock';
import { QuestProp } from '@app/features/main/interfaces/types';
import { EditorPanelPropsComponent } from './editor-panel-props.component';

let service: GameEditorService;
let gameMock = JSON.parse(JSON.stringify(questMockData));

describe('EditorPanelPropsComponent', () => {
  let component: EditorPanelPropsComponent;
  let fixture: ComponentFixture<EditorPanelPropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelPropsComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMock);
    service.setSelectedAreaId('start');
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle position lockouts', () => {
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.updatePropPositionLockouts();
    fixture.detectChanges();
    expect(component.lockouts.length).toBeGreaterThan(0);
  });

  it('should handle delete click', () => {
    spyOn(service, 'deleteProp');
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleDeleteClick('prop1');
    expect(service.deleteProp).toHaveBeenCalled();
  });

  it('should handle edit click', () => {
    spyOn(service, 'selectProp');
    component.props = gameMock.content.areas['start'].props;
    fixture.detectChanges();
    component.handleEditClick('prop1');
    fixture.detectChanges();
    expect(service.selectProp).toHaveBeenCalled();
  });

  it('should handle position select', () => {
    component.handlePositionSelect('1_1');
    fixture.detectChanges();
    expect(component.inputPropPosition).toBe('1_1');
  });

  it('should handle create click', () => {
    const mockPanel: QuestProp = {
      ...gameMock.content.areas['start'].props[0],
      id: 'prop1',
    };
    spyOn(service, 'createProp').and.returnValue(mockPanel);
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleCreateClick();
    expect(service.createProp).toHaveBeenCalled();
  });

  it('should handle input update', () => {
    spyOn(service, 'updateProp');
    component.area = gameMock.content.areas['start'];
    component.props = gameMock.content.areas['start'].props;
    component.selectedAreaId = 'start';
    component.selectedPropId = 'prop1';
    component.updateUiAfterPropSelection('prop1');
    component.inputPropPosition = '2_2';
    component.handlePropInputChange();
    fixture.detectChanges();
    expect(service.updateProp).toHaveBeenCalled();
  });

  it('should handle area change', fakeAsync(async () => {
    spyOn(service, 'getPropsForCurrentArea');
    fixture.detectChanges();
    service.setSelectedAreaId('area2');
    fixture.detectChanges();
    tick(500);
    expect(service.getPropsForCurrentArea).toHaveBeenCalled();
  }));

  it('should handle action input change', fakeAsync(async () => {
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
    fixture.detectChanges();
    component.area = gameMock.content.areas['start'];
    component.selectedAreaId = 'start';
    component.props = questMockData.content.areas['start'].props;
    fixture.detectChanges();
    const actions =
      questMockData.content.areas['start'].props[0].statusActions['on'];
    actions[0].actionObject = {
      ...actions[0].actionObject,
      identifier: '5_5',
    };
    component.selectedPropId = 'prop1';
    component.inputPropType = 'torch';
    component.inputPropPosition = '1_1';
    component.refreshUIData();
    fixture.detectChanges();

    spyOn(component, 'refreshUIData');
    component.handlePropActionInputChange(actions, 'on');
    fixture.detectChanges();
    tick(500);

    component.updateUiAfterPropSelection('prop1');
    fixture.detectChanges();
    expect(component.refreshUIData).toHaveBeenCalled();
  }));
});
