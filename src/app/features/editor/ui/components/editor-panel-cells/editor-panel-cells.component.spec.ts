import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorPanelCellsComponent } from './editor-panel-cells.component';

describe('EditorPanelCellsComponent', () => {
  let component: EditorPanelCellsComponent;
  let fixture: ComponentFixture<EditorPanelCellsComponent>;
  let gameEditorService: GameEditorService;
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
      imports: [EditorPanelCellsComponent],
    }).compileComponents();

    gameEditorService = TestBed.inject(GameEditorService);
    fixture = TestBed.createComponent(EditorPanelCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle toggling cell selector', () => {
    component.isCellSelectorOpen = false;
    component.handleToggleCellSelector();
    expect(component.isCellSelectorOpen).toBeTrue();

    component.isCellSelectorOpen = true;
    component.handleToggleCellSelector();
    expect(component.isCellSelectorOpen).toBeFalse();
  });

  it('should handle cell selection', () => {
    const positionKey = '5_4';
    spyOn(gameEditorService, 'setSelectedCellPosition');
    component.handleCellSelect(positionKey);
    expect(gameEditorService.setSelectedCellPosition).toHaveBeenCalledWith(
      positionKey
    );
  });

  it('should handle cell deselection', () => {
    spyOn(gameEditorService, 'setSelectedCellPosition');
    component.handleCellDeselect();
    expect(gameEditorService.setSelectedCellPosition).toHaveBeenCalledWith('');
  });
  it('should handle cell height change - up', () => {
    spyOn(gameEditorService, 'setCellData');
    component.selectedCell = {
      ...mockCell,
      h: 1,
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

  it('should handle floor change', () => {
    spyOn(gameEditorService, 'setCellData');
    component.selectedCell = mockCell;
    component.handleFloorChange('wood');
    expect(gameEditorService.setCellData).toHaveBeenCalledWith({
      ...component.selectedCell,
      floor: 'wood',
    });
  });
  it('should handle wall change', () => {
    spyOn(gameEditorService, 'setCellData');
    component.selectedCell = mockCell;
    component.handleWallChange('brick', 'south');
    expect(gameEditorService.setCellData).toHaveBeenCalledWith({
      ...component.selectedCell,
      wallSouth: 'brick',
    });
  });

  it('should handle wall change for east wall', () => {
    spyOn(gameEditorService, 'setCellData');
    component.selectedCell = mockCell;
    component.handleWallChange('brick', 'east');
    expect(gameEditorService.setCellData).toHaveBeenCalledWith({
      ...component.selectedCell,
      wallEast: 'brick',
    });
  });

  it('should reset textures for current area', () => {
    spyOn(gameEditorService, 'resetTexturesForCurrentArea');
    component.handleResetTexturesClick();
    expect(gameEditorService.resetTexturesForCurrentArea).toHaveBeenCalled();
  });
});
