import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import fetchMock from 'fetch-mock';
import { GameService } from './game-service.service';
import { gamesApiUrl } from '@config/index';
import gameMockData from '@app/features/editor/mocks/game.mock.json';

let gameMock = { ...gameMockData };
let gameMockFromDB = { ...gameMockData };

beforeEach(async () => {
  gameMock = await JSON.parse(
    JSON.stringify({
      ...gameMockData,
    })
  );
  gameMockFromDB = await JSON.parse(
    JSON.stringify({
      ...gameMockData,
    })
  );
  // GameROM `content` is stringified when saved to DB
  // @ts-expect-error
  gameMockFromDB.content = JSON.stringify(gameMockData.content);
});

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('loadGameROM', () => {
  let service: GameService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should load gameROM by id', () => {
    const url = `${gamesApiUrl}?id=test`;
    fetchMock.mockGlobal().get(
      url,
      { item: gameMockFromDB },
      {
        delay: 0,
      }
    );
    let i = 0;
    service.gameROMObs.subscribe((game) => {
      if (i === 0) {
        expect(game).toBeNull();
      } else {
        expect(game).toEqual(gameMock);
      }
      i += 1;
    });
    service.loadGameROM('test');
    fetchMock.unmockGlobal();
  });
});

describe('initGameState', () => {
  let service: GameService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should init gameState with ROM', () => {
    const url = `${gamesApiUrl}?id=test`;

    let i = 0;
    service.gameStateObs.subscribe((gameState) => {
      if (i === 0) {
        expect(gameState).toBeNull();
      } else {
        expect(gameState).not.toBeNull();
      }
      i += 1;
    });
    service.initGameState(gameMock);
  });
});
