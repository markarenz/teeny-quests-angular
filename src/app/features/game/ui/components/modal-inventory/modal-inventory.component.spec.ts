import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { ModalInventoryComponent } from './modal-inventory.component';
import gameMockData from '@app/features/editor/mocks/game.mock';
import { GameROM } from '@app/features/main/interfaces/types';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from '@app/features/game/services/message/message.service';

let gameMock = { ...gameMockData };

describe('ModalInventoryComponent', () => {
  let component: ModalInventoryComponent;
  let fixture: ComponentFixture<ModalInventoryComponent>;
  let service: GameService;
  let messageService: MessageService;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(async () => {
    gameMock = <GameROM>await JSON.parse(
      JSON.stringify({
        ...gameMockData,
      })
    );
    await TestBed.configureTestingModule({
      imports: [ModalInventoryComponent, ToastrModule.forRoot()],
      providers: [ToastrService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    messageService = TestBed.inject(MessageService);
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
    service.pageModalStatusObs.subscribe(status => {
      expect(status).toEqual(expectedValues[i]);
      if (i === 2) {
        flush();
      }
      i += 1;
    });
    service.setPageModalStatus('inventory');
    component.handleInventoryClose();
  }));
});
