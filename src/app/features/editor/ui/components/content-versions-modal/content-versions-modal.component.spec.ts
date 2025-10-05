import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ContentVersionsModalComponent } from './content-versions-modal.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { By } from '@angular/platform-browser';
import gameMockData from '@app/features/editor/mocks/game.mock';

let gameMock = JSON.parse(JSON.stringify(gameMockData));
const mockVersion = {
  id: 'version1',
  dateCreated: '2023-10-01T12:00:00Z',
  dateUpdated: '2023-10-02T12:00:00Z',
  content: JSON.stringify(gameMock),
};

describe('ContentVersionsModalComponent', () => {
  let component: ContentVersionsModalComponent;
  let fixture: ComponentFixture<ContentVersionsModalComponent>;
  let gameEditorService: GameEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentVersionsModalComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    gameEditorService = TestBed.inject(GameEditorService);
    gameEditorService.setTestValue(gameMock, 'game');
    fixture = TestBed.createComponent(ContentVersionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle modal close', () => {
    spyOn(component.onCloseModal, 'emit');
    component.handleModalClose();
    expect(component.onCloseModal.emit).toHaveBeenCalled();
  });

  it('should handle save version', async () => {
    spyOn(gameEditorService, 'createContentVersion').and.returnValue(
      Promise.resolve()
    );
    spyOn(gameEditorService, 'getContentVersionsForGame').and.returnValue();

    component.isSaving = false;
    component.isLoading = true;

    await component.handleSaveVersion();

    expect(component.isSaving).toBeFalse();
    expect(component.isLoading).toBeFalse();
    expect(gameEditorService.createContentVersion).toHaveBeenCalled();
    expect(gameEditorService.getContentVersionsForGame).toHaveBeenCalled();
  });

  it('should handle load version', () => {
    spyOn(gameEditorService, 'loadContentVersion').and.returnValue();
    component.handleLoadVersion('versionId');
    expect(gameEditorService.loadContentVersion).toHaveBeenCalled();
  });

  it('should handle delete version', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(gameEditorService, 'deleteContentVersion');
    component.handleDeleteVersion('versionId');
    expect(gameEditorService.deleteContentVersion).toHaveBeenCalled();
  });
});
