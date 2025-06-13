import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameAreaComponent } from './game-area.component';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { GameROM } from '@app/features/main/interfaces/types';
import gameMockData from '@app/features/editor/mocks/game.mock.json';

describe('GameAreaComponent', () => {
  let component: GameAreaComponent;
  let fixture: ComponentFixture<GameAreaComponent>;
  let service: GameService;
  let gameMockDataClean: GameROM;

  // update gameState
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAreaComponent],
    }).compileComponents();

    gameMockDataClean = await JSON.parse(
      JSON.stringify({
        ...gameMockData,
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
    const isNear = component.getIsNearPlayer(2, 2);
    expect(isNear).toBeTrue();
  });
  it('getIsNearPlayer should return false if coordinates are not near player', () => {
    component.playerPosition = '2_2';
    const isNear = component.getIsNearPlayer(4, 5);
    expect(isNear).toBeFalse();
  });
});
