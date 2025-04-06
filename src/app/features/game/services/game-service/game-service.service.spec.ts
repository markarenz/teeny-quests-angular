import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
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

describe('processTurn', () => {
  let service: GameService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
    service.testInit(gameMock);
  });

  it('should process turn', fakeAsync(() => {
    let i = 0;
    tick(1000);
    service.processTurn({
      verb: 'move',
      noun: '3_3',
    });
    tick(1000);

    service.isLockedOutObs.subscribe((isLockedOut) => {
      if (i === 0) {
        expect(isLockedOut).toEqual(false);
      }
      if (i === 1) {
        expect(isLockedOut).toEqual(true);
      }
      i += 1;
    });

    let j = 0;
    service.gameStateObs.subscribe((gameState) => {
      if (j === 1) {
        expect(gameState?.player?.x).toEqual(3);
        expect(gameState?.player?.y).toEqual(6);
        expect(gameState?.player?.facing).toEqual('east');
        flush();
      }
      j += 1;
    });
  }));
});

describe('getArea', () => {
  let service: GameService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);

    service.testInit(gameMock);
  });

  it('return the area by ID', () => {
    const actual = service.getArea('start');
    expect(actual?.id).toEqual('start');
  });
});

describe('getOppositeDirection', () => {
  let service: GameService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should return opposite direction', () => {
    expect(service.getOppositeDirection('north')).toEqual('south');
    expect(service.getOppositeDirection('south')).toEqual('north');
    expect(service.getOppositeDirection('east')).toEqual('west');
    expect(service.getOppositeDirection('west')).toEqual('east');
    expect(service.getOppositeDirection('nothing')).toEqual('nothing');
  });
});

describe('turnActionExit', () => {
  let service: GameService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
    service.testInit(gameMock);
  });

  it('should process turn exit', fakeAsync(() => {
    let i = 0;
    service.gameStateObs.subscribe((gameState) => {
      if (i === 3) {
        expect(gameState?.player?.areaId).toEqual('area2');
        expect(gameState?.player?.x).toEqual(2);
        expect(gameState?.player?.y).toEqual(0);
        expect(gameState?.player?.facing).toEqual('south');
        flush();
      }
      i += 1;
    });

    tick(250);
    service.processTurn({
      verb: 'exit',
      noun: '1735602762347',
    });
    service.turnActionExit('1735602762347');
    tick(250);
    tick(250);
    tick(250);
    tick(250);
    tick(250);
    tick(250);
    tick(250);
  }));
});
