import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameAreaComponent } from './game-area.component';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { QuestROM } from '@app/features/main/interfaces/types';
import questMockData from '@app/features/editor/mocks/game.mock';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from '@app/features/game/services/message/message.service';
import { mockActor } from '@app/features/editor/mocks/actor.mock';
import {
  ActorInteractionType,
  ActorStatus,
  ActorType,
} from '@app/features/main/interfaces/enums';

describe('GameAreaComponent', () => {
  let component: GameAreaComponent;
  let fixture: ComponentFixture<GameAreaComponent>;
  let service: GameService;
  let gameMockDataClean: QuestROM;
  let messageService: MessageService;

  // update gameState
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAreaComponent, ToastrModule.forRoot()],
      providers: [ToastrService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    messageService = TestBed.inject(MessageService);
    gameMockDataClean = await JSON.parse(
      JSON.stringify({
        ...questMockData,
      })
    );
    fixture = TestBed.createComponent(GameAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameService);
    service.testInit(gameMockDataClean);
    service.initGameState(gameMockDataClean);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle exit click', () => {
    spyOn(service, 'processTurn');
    const exitId = '1735602762347';
    component.handleExitClick(exitId);
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'exit',
      noun: exitId,
    });
  });

  it('should handle item click', () => {
    spyOn(service, 'processTurn');
    const itemId = '1234abc';
    component.handleItemClick(itemId);
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'item-click',
      noun: itemId,
    });
  });

  it('getIsNearPlayer should return true if coordinates are near player', () => {
    component.playerPosition = '2_2';
    const isNear = component.getIsNearPlayer(2, 2, true);
    expect(isNear).toBeTrue();
  });
  it('getIsNearPlayer should return true if coordinates are near player, not exact', () => {
    component.playerPosition = '2_3';
    const isNear = component.getIsNearPlayer(2, 2, false);
    expect(isNear).toBeTrue();
  });
  it('getIsNearPlayer should return false if coordinates are not near player', () => {
    component.playerPosition = '2_2';
    const isNear = component.getIsNearPlayer(4, 5, true);
    expect(isNear).toBeFalse();
  });

  it('should handle prop click', () => {
    spyOn(service, 'processTurn');
    const propId = '5678def';
    component.handlePropClick(propId);
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'prop-click',
      noun: propId,
    });
  });

  it('should handle actor click: invalid', () => {
    spyOn(service, 'processTurn');
    const actor = {
      ...mockActor,
      actorType: 'invalid',
    };
    component.handleActorClick(actor);
    expect(service.processTurn).not.toHaveBeenCalled();
  });

  it('should handle actor click: hostile', () => {
    spyOn(service, 'processTurn');
    const actor = {
      ...mockActor,
      ActorInteractionType: ActorInteractionType.HOSTILE,
    };
    component.handleActorClick(actor);
    expect(service.processTurn).toHaveBeenCalledWith({
      verb: 'attack',
      noun: actor.id,
    });
  });
});
