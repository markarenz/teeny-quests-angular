import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { gamesApiUrl } from '@config/index';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import fetchMock from 'fetch-mock';

import { GameEditorService } from './game-editor-service.service';

let gameMock = JSON.parse(JSON.stringify(gameMockData));

beforeEach(async () => {
  gameMock = await JSON.parse(JSON.stringify(gameMockData));
});

afterEach(() => {
  TestBed.resetTestingModule();
});

describe('GameEditorService', () => {
  let service: GameEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('getGameById', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should get game by id', () => {
    const url = `${gamesApiUrl}?id=test`;
    fetchMock.mockGlobal().get(
      url,
      { item: gameMock },
      {
        delay: 0,
      }
    );

    let i = 0;
    service.gameObs.subscribe((game) => {
      if (i === 0) {
        expect(game).toBeNull();
      } else {
        expect(game).toEqual(gameMock);
      }
      i += 1;
    });
    service.getGameById('test');

    fetchMock.unmockGlobal();
  });
});

describe('getGamesByUserId', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should get game by id', fakeAsync(() => {
    const url = `${gamesApiUrl}?userId=abcdefg1234`;
    fetchMock.mockGlobal().get(
      url,
      { items: [gameMock] },
      {
        delay: 0,
      }
    );

    let checkNow = false;
    service.gamesObs.subscribe((games) => {
      if (checkNow) {
        expect(games).toEqual([gameMock]);
      }
    });
    service.getGamesByUserId({
      id: 'abcdefg1234',
      name: 'Test Name',
    });
    tick(1000);
    checkNow = true;

    fetchMock.unmockGlobal();
  }));
});

describe('toggleMenu', () => {
  let service: GameEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should toggle menu', () => {
    let i = 0;
    const expectedValues = [false, true];
    service.isMenuOpenObs.subscribe((isOpen) => {
      expect(isOpen).toEqual(expectedValues[i]);
      i += 1;
    });
    service.toggleMenu();
  });
});

describe('setCellData', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should set cell data', () => {
    let i = 0;
    service.gameObs.subscribe((game) => {
      if (i === 1) {
        const cell = game
          ? game.content.areas['start'].map['6_6']
          : { floor: '' };
        expect(cell.floor).toEqual('test');
      }
      i += 1;
    });

    service.setCellData({
      x: 6,
      y: 6,
      h: 1,
      floor: 'test',
      wallEast: 'default',
      wallSouth: 'default',
    });
  });
});

describe('setSelectedAreaId', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should set selected area id', fakeAsync(() => {
    let checkNow = false;
    service.selectedAreaIdObs.subscribe((id) => {
      if (checkNow) {
        expect(id).toEqual('test');
      }
    });

    service.setSelectedAreaId('test');
    tick(1000);
    checkNow = true;
  }));
});

describe('setSelectedCellPosition', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should set selected cell position', fakeAsync(() => {
    let checkNow = false;
    service.selectedCellPositionObs.subscribe((value) => {
      if (checkNow) {
        expect(value).toEqual('3_3');
      }
    });
    service.setSelectedCellPosition('3_3');
    tick(1000);
    checkNow = true;
  }));
});

describe('processGameData', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should process game data', () => {
    const processedData = service.processGameData({
      ...gameMock,
      content: JSON.stringify(gameMock.content),
    });
    expect(processedData).toEqual(gameMock);
  });
});

describe('getAreasListOptions', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should get areas list options', fakeAsync(() => {
    tick(100);
    const options = service.getAreasListOptions();
    expect(options.length).toBeGreaterThan(0);
  }));
});

describe('getDefaultMap', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should get default map', () => {
    const map = service.getDefaultMap();
    expect(map['0_0']).toEqual({
      x: 0,
      y: 0,
      h: 10,
      floor: 'default',
      wallEast: 'default',
      wallSouth: 'default',
    });
  });
});

describe('createArea', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should create new area', fakeAsync(() => {
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
    let checkNow = false;
    service.gameObs.subscribe((game) => {
      if (checkNow) {
        const numAreas = game ? Object.keys(game.content.areas).length : 0;
        expect(numAreas).toEqual(3);
      }
    });

    tick(100);
    service.createArea();
    tick(100);
  }));
});

describe('renameCurrentSelectedArea', () => {
  it('should rename current selected area', () => {
    const service = new GameEditorService();
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');

    service.renameCurrentSelectedArea('New Name');

    service.gameObs.subscribe((game) => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.name).toEqual('New Name');
    });
  });
});

describe('deleteCurrentSelectedArea', () => {
  it('should delete current selected area', () => {
    const service = new GameEditorService();
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');

    service.deleteCurrentSelectedArea();

    service.gameObs.subscribe((game) => {
      const numAreas = game ? Object.keys(game.content.areas).length : 0;
      expect(numAreas).toEqual(1);
    });
  });
});

describe('resetTexturesForCurrentArea', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should reset textures for current area', fakeAsync(() => {
    let checkNow = false;
    service.gameObs.subscribe((game) => {
      if (checkNow) {
        const area = game ? game.content.areas['start'] : null;
        const cell = area ? area.map['6_6'] : null;
        expect(cell?.floor).toEqual('default');
      }
    });

    tick(1000);
    service.resetTexturesForCurrentArea();
    tick(1000);
  }));
});

describe('createGame', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should create game', fakeAsync(() => {
    const url = `${gamesApiUrl}`;
    fetchMock.mockGlobal().post(
      url,
      { item: gameMock },
      {
        delay: 0,
      }
    );

    let checkNow = false;
    service.gameObs.subscribe((game) => {
      if (checkNow) {
        expect(game).toEqual(gameMock);
      }
    });
    service.createGame({
      title: 'Test Game',
      description: 'Test Description',
      user: {
        id: 'abcdefg1234',
        name: 'Test Name',
      },
    });
    tick(1000);
    checkNow = true;

    fetchMock.unmockGlobal();
  }));
});

describe('updateStarterInventory', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should update starter inventory', () => {
    service.updateStarterInventory({
      gold: 10,
      'silver-key': 1,
    });

    let i = 0;
    service.gameObs.subscribe((game) => {
      const starterInventory = game ? game.content.player.inventory : [];
      if (i === 1) {
        expect(starterInventory.length).toBeGreaterThan(0);
      }
      i += 1;
    });
  });
});

describe('updateGame', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should update game', fakeAsync(() => {
    const service = new GameEditorService();

    let i = 0;
    service.gameObs.subscribe((game) => {
      if (i == 1) {
        expect(game).toEqual(gameMock);
      }
      i += 1;
    });
    service.updateGame(gameMock);
    tick(1000);

    fetchMock.unmockGlobal();
  }));
});
