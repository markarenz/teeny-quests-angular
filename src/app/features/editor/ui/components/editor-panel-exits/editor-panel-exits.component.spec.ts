import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { EditorPanelExitsComponent } from './editor-panel-exits.component';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { GameAreaExit } from '@app/features/main/interfaces/types';

let gameMock = JSON.parse(JSON.stringify(gameMockData));
let service: GameEditorService;

describe('EditorPanelExitsComponent', () => {
  let component: EditorPanelExitsComponent;
  let fixture: ComponentFixture<EditorPanelExitsComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    mockEventEmitter = new EventEmitter<string>();
    await TestBed.configureTestingModule({
      imports: [EditorPanelExitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelExitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMockData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle position lockouts', () => {
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.updateExitPositionLockouts();
    fixture.detectChanges();
    expect(component.lockouts.length).toBeGreaterThan(0);
  });

  it('should handle deletion', () => {
    spyOn(service, 'deleteExit');
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleDeleteClick('1735602762347');
    expect(service.deleteExit).toHaveBeenCalled();
  });

  it('should handle creation', () => {
    const mockExit: GameAreaExit = {
      ...gameMock.content.areas['start'].exits[0],
      id: '12345',
    };
    spyOn(service, 'createExit').and.returnValue(mockExit);
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleCreateClick();
    expect(service.createExit).toHaveBeenCalled();
  });

  it('should handle position selector change', () => {
    component.exits = gameMock.content.areas['start'].exits;
    fixture.detectChanges();
    component.handlePositionSelect('6_2');
    fixture.detectChanges();
    expect(component.inputExitPosition).toBe('6_2');
  });
});
