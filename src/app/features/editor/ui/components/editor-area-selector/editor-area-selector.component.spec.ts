import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorAreaSelectorComponent } from './editor-area-selector.component';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GameROM } from '@app/features/main/interfaces/types';

describe('EditorAreaSelectorComponent', () => {
  let component: EditorAreaSelectorComponent;
  let fixture: ComponentFixture<EditorAreaSelectorComponent>;
  let gameEditorService: GameEditorService;
  let gameMock: GameROM;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAreaSelectorComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    gameMock = <GameROM>JSON.parse(JSON.stringify(gameMockData));
    gameEditorService = TestBed.inject(GameEditorService);
    gameEditorService.setTestValue('start', 'selectedAreaId');
    gameEditorService.setTestValue(gameMock, 'game');

    fixture = TestBed.createComponent(EditorAreaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle selected area change', () => {
    const areaId = 'test';
    component.selectedAreaLocal = areaId;
    spyOn(gameEditorService, 'setSelectedAreaId');
    component.handleSelectedAreaChange();
    expect(gameEditorService.setSelectedAreaId).toHaveBeenCalledWith(areaId);
  });
  it('should handle rename click', () => {
    const areaId = 'start';
    component.selectedAreaLocal = areaId;
    component.areasListOptions =
      gameEditorService.getDestinationAreasListOptions();
    component.handleRenameClick();
    expect(component.inputAreaRename).toBe('Start Area');
    expect(component.uiMode).toBe('rename');
  });

  it('should handle rename cancel click', () => {
    component.uiMode = 'rename';
    component.handleRenameCancelClick();
    expect(component.uiMode).toBe('select');
  });

  it('should handle rename ok click', () => {
    const newName = 'New Area Name';
    component.inputAreaRename = newName;
    component.selectedAreaLocal = 'start';
    spyOn(gameEditorService, 'renameCurrentSelectedArea');
    component.handleRenameOkClick();
    expect(gameEditorService.renameCurrentSelectedArea).toHaveBeenCalledWith(
      newName
    );
    expect(component.uiMode).toBe('select');
  });

  it('should handle delete area click', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(gameEditorService, 'deleteCurrentSelectedArea');
    component.handleDeleteAreaClick();
    expect(gameEditorService.deleteCurrentSelectedArea).toHaveBeenCalled();
  });

  it('should handle new area click', () => {
    spyOn(gameEditorService, 'createArea');
    component.handleNewAreaClick();
    expect(gameEditorService.createArea).toHaveBeenCalled();
  });
});
