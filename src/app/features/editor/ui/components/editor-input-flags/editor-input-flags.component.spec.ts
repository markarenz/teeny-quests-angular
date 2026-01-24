import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { EditorInputFlagsComponent } from './editor-input-flags.component';

let service: GameEditorService;

describe('EditorInputFlagsComponent', () => {
  let component: EditorInputFlagsComponent;
  let fixture: ComponentFixture<EditorInputFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInputFlagsComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorInputFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleInputChange', () => {
    spyOn(service, 'updateFlag');
    component.selectedFlagId = 'flag1';
    component.selectedFlag = { id: 'flag1', name: 'Test Flag', scoreValue: 5 };
    component.inputName = 'Test Flag 1';
    component.inputScoreValue = 10;
    component.handleInputChange();
    expect(service.updateFlag).toHaveBeenCalledWith({
      id: 'flag1',
      name: 'Test Flag 1',
      scoreValue: 10,
    });
  });

  it('should handleCreateClick', () => {
    spyOn(service, 'createFlag');
    component.handleCreateClick();
    expect(service.createFlag).toHaveBeenCalled();
  });

  it('should handleDeleteClick', () => {
    spyOn(service, 'deleteFlag');
    component.selectedFlagId = 'flag1';
    component.selectedFlag = { id: 'flag1', name: 'Test Flag', scoreValue: 5 };
    component.handleDeleteClick('flag1');
    expect(component.selectedFlagId).toBe('');
    expect(component.selectedFlag).toBeNull();
    expect(service.deleteFlag).toHaveBeenCalledWith('flag1');
  });

  it('should handleEditClick', () => {
    component.flags = [
      { id: 'flag1', name: 'Test Flag', scoreValue: 5 },
      { id: 'flag2', name: 'Another Flag', scoreValue: 10 },
    ];
    component.selectedFlagId = '';
    component.handleEditClick('flag1');
    expect(component.selectedFlagId).toBe('flag1');
    expect(component.selectedFlag).toEqual({
      id: 'flag1',
      name: 'Test Flag',
      scoreValue: 5,
    });

    // Toggle off
    component.handleEditClick('flag1');
    expect(component.selectedFlagId).toBe('');
    expect(component.selectedFlag).toBeNull();
  });
  it('should handleEditClick - invalid ID', () => {
    component.flags = [
      { id: 'flag1', name: 'Test Flag', scoreValue: 5 },
      { id: 'flag2', name: 'Another Flag', scoreValue: 10 },
    ];
    component.selectedFlagId = '';
    component.handleEditClick('flag-invalid');
    expect(component.selectedFlagId).toBe('');
  });
});
