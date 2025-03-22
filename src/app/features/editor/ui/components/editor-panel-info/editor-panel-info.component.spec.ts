import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditorPanelInfoComponent } from './editor-panel-info.component';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

let service: GameEditorService;
let gameMock = JSON.parse(JSON.stringify(gameMockData));

describe('EditorPanelInfoComponent', () => {
  let component: EditorPanelInfoComponent;
  let fixture: ComponentFixture<EditorPanelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle input changes', () => {
    spyOn(service, 'updateGame');
    const elementDescription = fixture.debugElement.query(
      By.css(`[id="new-game--description"]`)
    );
    elementDescription.nativeElement.value = 'test description';
    elementDescription.nativeElement.dispatchEvent(new Event('input'));
    const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
    elementDescription.nativeElement.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(service.updateGame).toHaveBeenCalled();
  });

  it('should handle starting area change', () => {
    component.handleStartingAreaChange('area2');
    fixture.detectChanges();
    expect(component.inputStartingAreaId).toBe('area2');
  });

  it('should handle start position change', () => {
    component.handlePlayerStartPositionChange('4_4');
    fixture.detectChanges();
    expect(component.inputStartingAreaPosition).toBe('4_4');
  });
});
