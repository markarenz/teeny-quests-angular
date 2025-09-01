import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GamePanelDeco } from '@app/features/main/interfaces/types';
import { EditorPanelPanelDecoComponent } from './editor-panel-paneldeco.component';

let service: GameEditorService;
let gameMock = JSON.parse(JSON.stringify(gameMockData));

describe('EditorPanelPanelDecoComponent', () => {
  let component: EditorPanelPanelDecoComponent;
  let fixture: ComponentFixture<EditorPanelPanelDecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelPanelDecoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelPanelDecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMock);
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
    component.updatePanelPositionLockouts();
    fixture.detectChanges();
    expect(component.lockouts.length).toBeGreaterThan(0);
  });

  it('should handle delete click', () => {
    spyOn(service, 'deletePanel');
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleDeleteClick('panel1');
    expect(service.deletePanel).toHaveBeenCalled();
  });

  it('should handle edit click', () => {
    spyOn(service, 'selectPanel');
    component.panels = gameMock.content.areas['start'].panels;
    fixture.detectChanges();
    component.handleEditClick('panel1');
    fixture.detectChanges();
    expect(service.selectPanel).toHaveBeenCalled();
  });

  it('should handle position select', () => {
    component.handlePositionSelect('1_1');
    fixture.detectChanges();
    expect(component.inputPanelPosition).toBe('1_1');
  });

  it('should handle create click', () => {
    const mockPanel: GamePanelDeco = {
      ...gameMock.content.areas['start'].panels[0],
      id: '12345',
    };
    spyOn(service, 'createPanel').and.returnValue(mockPanel);
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleCreateClick();
    expect(service.createPanel).toHaveBeenCalled();
  });

  it('should handle input update', () => {
    const mockPanel: GamePanelDeco = {
      ...gameMock.content.areas['start'].panels[0],
      id: '12345',
    };
    spyOn(service, 'updatePanel');
    component.panels = gameMock.content.areas['start'].panels;
    console.log('...>>>?', component.panels);
    component.selectedPanelId = 'panel1';
    component.inputPanelPosition = '2_2';
    component.handlePanelInputChange();
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    expect(service.updatePanel).toHaveBeenCalled();
  });

  it('should handle area change', fakeAsync(async () => {
    console.log(
      '...area change test.............................................'
    );
    spyOn(service, 'getPanelsForCurrentArea');
    fixture.detectChanges();
    service.setSelectedAreaId('area2');
    fixture.detectChanges();
    tick(500);
    expect(service.getPanelsForCurrentArea).toHaveBeenCalled();
  }));
});
