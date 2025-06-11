import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { ModalInventoryComponent } from './modal-inventory.component';
import gameMockData from '@app/features/editor/mocks/game.mock.json';

let gameMock = { ...gameMockData };

describe('ModalInventoryComponent', () => {
  let component: ModalInventoryComponent;
  let fixture: ComponentFixture<ModalInventoryComponent>;
  let service: GameService;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(async () => {
    gameMock = await JSON.parse(
      JSON.stringify({
        ...gameMockData,
      })
    );
    await TestBed.configureTestingModule({
      imports: [ModalInventoryComponent],
    }).compileComponents();
    service = TestBed.inject(GameService);

    fixture = TestBed.createComponent(ModalInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    service.testInit(gameMock);
    expect(component).toBeTruthy();
  });

  it('should handle initial subscription null data', () => {
    expect(component).toBeTruthy();
  });

  it('should handle inventory close', fakeAsync(() => {
    let i = 0;
    const expectedValues = ['', 'inventory', ''];
    service.pageModalStatusObs.subscribe((status) => {
      expect(status).toEqual(expectedValues[i]);
      if (i === 2) {
        flush();
      }
      i += 1;
    });
    service.setPageModalStatus('inventory');
    component.handleInventoryClose();
  }));

  it('should handle action click', fakeAsync(() => {
    component.canDrop = true;
    spyOn(service, 'processTurn');
    component.handleItemActionClick('item-1', 'drop');
    fixture.detectChanges();
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'item-drop',
      noun: 'item-1',
    });
  }));
});
