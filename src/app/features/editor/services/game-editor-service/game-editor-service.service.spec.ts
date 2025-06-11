import { fakeAsync, TestBed, tick, flush } from '@angular/core/testing';
import { firstValueFrom, skip, take } from 'rxjs';
import { gamesApiUrl } from '@config/index';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import fetchMock from 'fetch-mock';

import { GameEditorService } from './game-editor-service.service';
import { GameAreaExit, GameItem } from '@app/features/main/interfaces/types';

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
        expect(id).toEqual('start');
      }
    });

    service.setSelectedAreaId('start');
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

  it('should set selected cell position', fakeAsync(async () => {
    service.setSelectedCellPosition('3_3');
    tick(10);
    const value = await firstValueFrom(service.selectedCellPositionObs);
    expect(value).toEqual('3_3');
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

describe('getDestinationAreasListOptions', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should get areas list options', fakeAsync(() => {
    tick(100);
    const options = service.getDestinationAreasListOptions();
    expect(options.length).toBeGreaterThan(0);
  }));
});

describe('getDestinationExitsListOptions', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should get exits list options', fakeAsync(() => {
    tick(100);
    const options = service.getDestinationExitsListOptions('start');
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

  it('should reset textures for current area', fakeAsync(async () => {
    service.resetTexturesForCurrentArea();
    tick(10);
    const game = await firstValueFrom(service.gameObs);
    const area = game ? game.content.areas['start'] : null;
    const cell = area ? area.map['6_6'] : null;
    expect(cell?.floor).toEqual('default');
    flush();
  }));
});

describe('createGame', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
  });

  it('should create game', fakeAsync(async () => {
    const url = `${gamesApiUrl}`;
    fetchMock.mockGlobal().post(
      url,
      { ...gameMock },
      {
        delay: 0,
      }
    );

    const newId = await service.createGame({
      title: 'Test Game',
      description: 'Test Description',
      user: {
        id: 'abcdefg1234',
        name: 'Test Name',
      },
    });
    expect(newId).toBeDefined();

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

describe('updateitem', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should update item', () => {
    const item: GameItem = {
      id: '1735602762347',
      itemType: 'coins',
      areaId: 'start',
      x: 0,
      y: 0,
      h: 1,
    };

    let i = 0;
    service.gameObs.subscribe((game) => {
      if (i === 1) {
        const area = game ? game.content.areas['start'] : null;
        const item = area ? area.items[0] : null;
        expect(item).toEqual({
          ...item,
          ...gameMock.content.areas['start'].items[0],
        });
      }
      i += 1;
    });

    service.updateItem(item);
  });
});

describe('deleteItem', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should delete item', () => {
    let i = 0;
    const expectedValues = [1, 0];
    service.gameObs.subscribe((game) => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.items.length).toEqual(expectedValues[i]);
    });

    service.deleteItem('1735602762347');
  });
});

describe('createItem', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should create item', () => {
    let i = 0;
    const expectedValues = [1, 2];
    service.gameObs.subscribe((game) => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.items.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.createItem();
  });
});

describe('createExit', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should create exit', () => {
    let i = 0;
    const expectedValues = [1, 2];
    service.gameObs.subscribe((game) => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.exits.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.createExit();
  });
});

describe('deleteExit', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should delete exit', () => {
    let i = 0;
    const exitId = '1735602762347';
    const expectedValues = [1, 0];
    service.gameObs.subscribe((game) => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.exits.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.deleteExit(exitId);
  });
});

describe('updateExit', () => {
  let service: GameEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should update exit', () => {
    const exit: GameAreaExit = {
      id: '1735602762347',
      destinationAreaId: '1735602762347',
      destinationExitId: '123',
      exitType: 'default',
      direction: 'north',
      areaId: 'start',
      x: 1,
      y: 1,
      h: 4,
    };

    let i = 0;
    service.gameObs.subscribe((game) => {
      if (i === 1) {
        const area = game ? game.content.areas['start'] : null;
        const updatedExit = area ? area.exits[0] : null;
        expect(updatedExit).toEqual(exit);
      }
      i += 1;
    });

    service.updateExit(exit);
  });
});
