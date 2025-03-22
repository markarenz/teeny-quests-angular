import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { EditorPanelItemsComponent } from './editor-panel-items.component';
import { GameAreaExit, GameItem } from '@app/features/main/interfaces/types';

let service: GameEditorService;
let gameMock = JSON.parse(JSON.stringify(gameMockData));

describe('EditorPanelItemsComponent', () => {
  let component: EditorPanelItemsComponent;
  let fixture: ComponentFixture<EditorPanelItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle position lockouts', () => {
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.updateItemPositionLockouts();
    fixture.detectChanges();
    expect(component.lockouts.length).toBeGreaterThan(0);
  });

  it('should handle delete click', () => {
    spyOn(service, 'deleteItem');
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleDeleteClick('1735602762347');
    expect(service.deleteItem).toHaveBeenCalled();
  });

  it('should handle edit click', () => {
    component.items = gameMock.content.areas['start'].items;
    fixture.detectChanges();
    component.handleEditClick('1234abc');
    fixture.detectChanges();
    expect(component.inputItemType).toBe('coins-25');
  });

  it('should handle position select', () => {
    component.handlePositionSelect('1_1');
    fixture.detectChanges();
    expect(component.inputItemPosition).toBe('1_1');
  });

  it('should handle create click', () => {
    const mockItem: GameItem = {
      ...gameMock.content.areas['start'].items[0],
      id: '12345',
    };
    spyOn(service, 'createItem').and.returnValue(mockItem);
    component.area = gameMock.content.areas['start'];
    fixture.detectChanges();
    component.handleCreateClick();
    expect(service.createItem).toHaveBeenCalled();
  });
});
