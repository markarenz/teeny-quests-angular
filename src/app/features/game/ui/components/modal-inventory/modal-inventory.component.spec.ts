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
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    service = TestBed.inject(GameService);

    fixture = TestBed.createComponent(ModalInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service.testInit(gameMock);
    service.initGameState(gameMock);
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

  it('should handle action click - drop', fakeAsync(() => {
    component.canDrop = true;
    spyOn(service, 'processTurn');
    component.handleItemActionClick('item-1', 'drop');
    fixture.detectChanges();
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'item-drop',
      noun: 'item-1',
    });
  }));

  it('should handle action click - use', fakeAsync(() => {
    component.canDrop = true;
    spyOn(service, 'processTurn');
    component.handleItemActionClick('1234abc', 'use');
    fixture.detectChanges();
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'item-use',
      noun: '1234abc',
    });
  }));

  it('getCanUseItem - return false when item is not usable', () => {
    const result = component.getCanUseItem('1234abc');
    expect(result).toBeFalse();
  });
});
