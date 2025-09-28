import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorInputActionsComponent } from './editor-input-actions.component';
import { EventEmitter } from '@angular/core';
import { ActionEffect } from '@app/features/main/interfaces/types';
import gameMockData from '@app/features/editor/mocks/game.mock';

describe('EditorInputActionsComponent', () => {
  let component: EditorInputActionsComponent;
  let fixture: ComponentFixture<EditorInputActionsComponent>;
  let gameEditorService: GameEditorService;
  let mockEventEmitter: EventEmitter<ActionEffect[]>;
  let gameMock = JSON.parse(JSON.stringify(gameMockData));

  beforeEach(async () => {
    gameMock = JSON.parse(JSON.stringify(gameMockData));
    mockEventEmitter = new EventEmitter<ActionEffect[]>();
    await TestBed.configureTestingModule({
      imports: [EditorInputActionsComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    gameEditorService = TestBed.inject(GameEditorService);
    fixture = TestBed.createComponent(EditorInputActionsComponent);
    component = fixture.componentInstance;
    component.onActionsChange = mockEventEmitter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle edit click', () => {
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.handleEditClick('action-1758468156810');
    expect(component.inputActionType).toEqual('update-map-cell-height');
  });

  it('should handle position select', () => {
    component.selectedActionId = 'action-1758468156810';
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.selectedAction =
      component.actions.find(a => a.id === component.selectedActionId) || null;
    component.handlePositionSelect('2_2');
    expect(component.inputActionPosition).toEqual('2_2');
  });

  it('should handle position select - error missing data', () => {
    component.selectedActionId = 'action-1758468156810';
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.selectedAction = null;
    component.handlePositionSelect('2_2');
    expect(component.inputActionPosition).toEqual('0_0');
  });

  it('should handle number input', () => {
    component.selectedActionId = 'action-1758468156810';
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.selectedAction =
      component.actions.find(a => a.id === component.selectedActionId) || null;
    component.inputNumberValue = '5';
    spyOn(component.onActionsChange, 'emit');
    component.handleActionInputNumberChange();
    expect(component.onActionsChange.emit).toHaveBeenCalled();
  });

  it('should handle number input - error', () => {
    component.selectedActionId = 'action-1758468156810';
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.selectedAction = null;
    component.inputNumberValue = '5';
    spyOn(component.onActionsChange, 'emit');
    component.handleActionInputNumberChange();
    expect(component.onActionsChange.emit).not.toHaveBeenCalled();
  });

  it('should handle create click', () => {
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.inputActionType = 'update-map-cell-height';
    spyOn(component.onActionsChange, 'emit');
    component.handleCreateClick();
    expect(component.onActionsChange.emit).toHaveBeenCalled();
  });

  it('should handle labels', () => {
    const action =
      gameMock.content.areas['start'].panels[0].statusActions.on[0];

    const label = component.getActionLabel(action);
    expect(label).toEqual('Update Map Cell Height');
  });

  it('should handle action type change', () => {
    component.selectedActionId = 'action-1758468156810';
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.selectedAction =
      component.actions.find(a => a.id === component.selectedActionId) || null;
    component.inputActionType = 'update-map-cell-height';
    spyOn(component.onActionsChange, 'emit');
    component.handleActionInputChange();
    expect(component.onActionsChange.emit).toHaveBeenCalled();
  });

  it('should handle action type change - error', () => {
    component.selectedActionId = 'action-1758468156810';
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    component.selectedAction = null;
    component.inputActionType = 'update-map-cell-height';
    spyOn(component.onActionsChange, 'emit');
    component.handleActionInputChange();
    expect(component.onActionsChange.emit).not.toHaveBeenCalled();
  });
  it('should handle delete click', () => {
    component.actions =
      gameMock.content.areas['start'].panels[0].statusActions.on;
    spyOn(component.onActionsChange, 'emit');
    component.handleDeleteClick('action-1758468156810');
    expect(component.onActionsChange.emit).toHaveBeenCalled();
  });
});
