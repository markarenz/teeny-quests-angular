import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorInventoryComponent } from './editor-inventory.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import gameMockData from '@app/features/editor/mocks/game.mock';

let service: GameEditorService;

describe('EditorInventoryComponent', () => {
  let component: EditorInventoryComponent;
  let fixture: ComponentFixture<EditorInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInventoryComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMockData);
  });

  it('should create', async () => {
    expect(component).toBeTruthy();

    service.gameObs.subscribe(game => {
      expect(game).toEqual(gameMockData);
    });
  });

  it('should handle inventory updates', () => {
    // 1: Create new blank item
    const gameMockData1 = JSON.parse(JSON.stringify(gameMockData));
    gameMockData1.content.player.inventory[''] = 0;
    // 2: Delete original item 'gold'
    const gameMockData2 = JSON.parse(JSON.stringify(gameMockData));
    gameMockData2.content.player.inventory = { '': 0 };
    let i = 0;
    const expectedResults = [
      gameMockData,
      gameMockData1,
      gameMockData1,
      gameMockData2,
    ];
    service.gameObs.subscribe(game => {
      expect(game).toEqual(expectedResults[i]);
      i += 1;
    });

    component.handleAddInventoryItem();
    component.handleQtyInputChange();
    component.handleDeleteInventoryItem('gold');
  });
});
