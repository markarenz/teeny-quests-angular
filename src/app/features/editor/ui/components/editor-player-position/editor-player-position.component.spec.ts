import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorPlayerPositionComponent } from './editor-player-position.component';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GameROM } from '@app/features/main/interfaces/types';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

describe('EditorPlayerPositionComponent', () => {
  let component: EditorPlayerPositionComponent;
  let fixture: ComponentFixture<EditorPlayerPositionComponent>;
  let gameMock: GameROM;
  let gameEditorService: GameEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPlayerPositionComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    gameMock = <GameROM>JSON.parse(JSON.stringify(gameMockData));

    gameEditorService = TestBed.inject(GameEditorService);
    fixture = TestBed.createComponent(EditorPlayerPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    gameEditorService.setTestValue('start', 'selectedAreaId');
    component.selectedAreaId = 'start';

    gameEditorService.setTestValue(gameMock, 'game');
    component.selectedAreaId = 'start';

    expect(component).toBeTruthy();
  });

  it('should handle changed player position prop', () => {
    component.selectedAreaId = 'start';
    component.selectedArea = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.playerPosition = '5_5';
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.positionStyle.left.substring(0, 2)).toBe('42');
  });
});
