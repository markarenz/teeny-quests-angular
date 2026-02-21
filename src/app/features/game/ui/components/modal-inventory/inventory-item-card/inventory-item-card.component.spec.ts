import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { InventoryItemCardComponent } from './inventory-item-card.component';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import gameMockData from '@app/features/editor/mocks/game.mock';
import { MessageService } from '@app/features/game/services/message/message.service';

let gameMock = { ...gameMockData };

describe('InventoryItemCardComponent', () => {
  let component: InventoryItemCardComponent;
  let fixture: ComponentFixture<InventoryItemCardComponent>;
  let service: GameService;
  let messageService: MessageService;

  beforeEach(async () => {
    let gameMock = structuredClone(gameMockData);

    await TestBed.configureTestingModule({
      imports: [InventoryItemCardComponent, ToastrModule.forRoot()],
      providers: [ToastrService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    service = TestBed.inject(GameService);
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(InventoryItemCardComponent);
    component = fixture.componentInstance;
    component.key = 'sapphire';
    component.currentInventory = { sapphire: 2 };
    component.canDrop = true;
    fixture.detectChanges();
    service.testInit(gameMock);
    service.initGameState(gameMock);
  });

  it('should create', () => {
    service.testInit(gameMock);
    expect(component).toBeTruthy();
  });

  it('should handle action click - drop', fakeAsync(() => {
    component.canDrop = true;
    spyOn(service, 'processTurn');
    component.handleItemActionClick('drop');
    fixture.detectChanges();
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'item-drop',
      noun: 'sapphire',
    });
  }));

  it('should handle action click - use', fakeAsync(() => {
    component.canDrop = true;
    spyOn(service, 'processTurn');
    component.handleItemActionClick('use');
    fixture.detectChanges();
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'item-use',
      noun: 'sapphire',
    });
  }));

  it('should handle action click - info', fakeAsync(() => {
    component.canDrop = true;
    spyOn(service, 'processTurn');
    component.handleItemActionClick('info');
    fixture.detectChanges();
    expect(component.uiMode).toEqual('info');
    component.handleItemActionClick('info');
    fixture.detectChanges();
    expect(component.uiMode).toEqual('default');
  }));

  it('getCanUseItem - return false when item is not usable', () => {
    const result = component.getCanUseItem();
    expect(result).toBeFalse();
  });
});
