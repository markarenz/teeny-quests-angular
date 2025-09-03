import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaCellModalComponent } from './area-cell-modal.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EventEmitter } from '@angular/core';

describe('AreaCellModalComponent', () => {
  let component: AreaCellModalComponent;
  let fixture: ComponentFixture<AreaCellModalComponent>;
  let gameEditorService: GameEditorService;
  let mockEventEmitter: EventEmitter<void>;
  const mockCell = {
    x: 0,
    y: 0,
    h: 2,
    floor: 'default',
    wallEast: 'default',
    wallSouth: 'default',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCellModalComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<void>();
    gameEditorService = TestBed.inject(GameEditorService);
    fixture = TestBed.createComponent(AreaCellModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle cell height change - up', () => {
    spyOn(gameEditorService, 'setCellData');
    component.selectedCell = {
      x: 0,
      y: 0,
      h: 1,
      floor: 'default',
      wallEast: 'default',
      wallSouth: 'default',
    };
    component.handleCellHeightChange('up');
    expect(gameEditorService.setCellData).toHaveBeenCalledWith({
      ...component.selectedCell,
      h: 2,
    });
  });

  it('should handle cell height change - down', () => {
    spyOn(gameEditorService, 'setCellData');
    component.selectedCell = mockCell;
    component.handleCellHeightChange('down');
    expect(gameEditorService.setCellData).toHaveBeenCalledWith({
      ...component.selectedCell,
      h: 1,
    });
  });

  it('should validate form', () => {
    component.isFormValid = false;
    component.validateForm();
    expect(component.isFormValid).toBeTrue();
  });

  it('should handle cancel click', () => {
    component.clearCellSelection = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleCancelClick();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });

  it('should handle cancel click', () => {
    spyOn(gameEditorService, 'setCellData');
    component.inputHeight = 3;
    component.selectedCell = mockCell;
    component.handleOkClick();
    expect(gameEditorService.setCellData).toHaveBeenCalledWith({
      ...mockCell,
      h: 3,
    });
  });
});
