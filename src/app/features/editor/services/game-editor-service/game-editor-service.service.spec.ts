import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { gamesApiUrl, versionsApiUrl } from '@config/index';
import gameMockData from '@app/features/editor/mocks/game.mock';
import fetchMock from 'fetch-mock';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { GameEditorService } from './game-editor-service.service';
import {
  GameAreaExit,
  GameItem,
  GameProp,
} from '@app/features/main/interfaces/types';
import { firstValueFrom, skip, take } from 'rxjs';
import { provideOAuthClient } from 'angular-oauth2-oidc'; // Assuming a similar provider function exists
import { provideHttpClient } from '@angular/common/http';
let gameMock = JSON.parse(JSON.stringify(gameMockData));

beforeEach(async () => {
  gameMock = await JSON.parse(JSON.stringify(gameMockData));
  TestBed.configureTestingModule({
    imports: [],
    providers: [AuthProviderService, provideOAuthClient(), provideHttpClient()],
    teardown: { destroyAfterEach: false },
  });
});
afterEach(() => {
  TestBed.resetTestingModule();
});

describe('GameEditorService', () => {
  let service: GameEditorService;

  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('getGameById', () => {
  let service: GameEditorService;
  beforeEach(() => {
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
    service.gameObs.subscribe(game => {
      if (i === 0) {
        expect(game).toBeNull();
      } else {
        expect(game).not.toBeNull();
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
    service = TestBed.inject(GameEditorService);
  });

  it('should get game by id', fakeAsync(async () => {
    const url = `${gamesApiUrl}?userId=abcdefg1234`;
    fetchMock.mockGlobal().get(
      url,
      { items: [gameMock] },
      {
        delay: 0,
      }
    );

    service.getGamesByUserId({
      id: 'abcdefg1234',
      name: 'Test Name',
    });
    tick(10);
    const games = await service.gamesObs.pipe(skip(1), take(1)).toPromise();
    expect(games).toEqual([gameMock]);
    fetchMock.unmockGlobal();
  }));
});

describe('toggleMenu', () => {
  let service: GameEditorService;

  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
  });

  it('should toggle menu', () => {
    let i = 0;
    const expectedValues = [false, true];
    service.isMenuOpenObs.subscribe(isOpen => {
      expect(isOpen).toEqual(expectedValues[i]);
      i += 1;
    });
    service.toggleMenu();
  });
});

describe('setCellData', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should set cell data', () => {
    let i = 0;
    service.gameObs.subscribe(game => {
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
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should set selected area id', fakeAsync(async () => {
    service.setSelectedAreaId('start');
    tick(110);
    const id = await firstValueFrom(
      service.selectedAreaIdObs.pipe(skip(0), take(1))
    );
    expect(id).toEqual('start');
  }));
});

describe('setSelectedCellPosition', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should set selected cell position', fakeAsync(async () => {
    service.setSelectedCellPosition('3_3');
    tick(1000);
    const value = await firstValueFrom(
      service.selectedCellPositionObs.pipe(skip(0), take(1))
    );
    expect(value).toEqual('3_3');
  }));
});

describe('processGameData', () => {
  let service: GameEditorService;
  beforeEach(() => {
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
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should get areas list options', fakeAsync(() => {
    tick(100);
    const options = service.getAreasListOptions();
    expect(options.length).toBeGreaterThan(0);
  }));
});

describe('getDestinationExitsListOptions', () => {
  let service: GameEditorService;
  beforeEach(() => {
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
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should create new area', fakeAsync(async () => {
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
    tick(110);
    service.createArea();
    tick(110);
    const game = await firstValueFrom(service.gameObs.pipe(skip(0), take(1)));
    flush();
    const numAreas = game ? Object.keys(game.content.areas).length : 0;
    expect(numAreas).toEqual(3);
  }));
});

describe('renameCurrentSelectedArea', () => {
  it('should rename current selected area', () => {
    const authProviderService = TestBed.inject(AuthProviderService);
    const service = new GameEditorService(authProviderService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');

    service.renameCurrentSelectedArea('New Name');

    service.gameObs.subscribe(game => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.name).toEqual('New Name');
    });
  });
});

describe('deleteCurrentSelectedArea', () => {
  it('should delete current selected area', () => {
    const authProviderService = TestBed.inject(AuthProviderService);
    const service = new GameEditorService(authProviderService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');

    service.deleteCurrentSelectedArea();

    service.gameObs.subscribe(game => {
      const numAreas = game ? Object.keys(game.content.areas).length : 0;
      expect(numAreas).toEqual(1);
    });
  });
});

describe('resetTexturesForCurrentArea', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should reset textures for current area', fakeAsync(async () => {
    service.resetTexturesForCurrentArea();
    tick(1000);
    const game = await firstValueFrom(service.gameObs.pipe(skip(0), take(1)));
    const area = game ? game.content.areas['start'] : null;
    const cell = area ? area.map['6_6'] : null;
    expect(cell?.floor).toEqual('default');
  }));
});

describe('createGame', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should create game', fakeAsync(async () => {
    const url = `${gamesApiUrl}`;
    fetchMock.mockGlobal().post(
      url,
      { item: gameMock },
      {
        delay: 0,
      }
    );
    const mockTitle = 'Game 3b2';
    service.createGame({
      title: mockTitle,
      description: 'Test Description',
      user: {
        id: 'abcdefg1234',
        name: 'Test Name',
      },
    });
    tick(10);
    const game = await firstValueFrom(service.gameObs.pipe(skip(0), take(1)));
    expect(game?.title).toEqual(mockTitle);
    fetchMock.unmockGlobal();
  }));
});

describe('updateStarterInventory', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should update starter inventory', fakeAsync(async () => {
    service.updateStarterInventory({
      gold: 10,
      'silver-key': 1,
    });
    tick(10);
    const game = await firstValueFrom(service.gameObs.pipe(skip(0), take(1)));
    const starterInventory = game ? game.content.player.inventory : {};
    expect(Object.keys(starterInventory).length).toBeGreaterThan(1);
  }));
});

describe('updateGame', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
  });

  it('should update game', fakeAsync(() => {
    const authProviderService = TestBed.inject(AuthProviderService);
    const service = new GameEditorService(authProviderService);

    let i = 0;
    service.gameObs.subscribe(game => {
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
    service.gameObs.subscribe(game => {
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
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should delete item', () => {
    let i = 0;
    const expectedValues = [1, 0];
    service.gameObs.subscribe(game => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.items.length).toEqual(expectedValues[i]);
    });

    service.deleteItem('1735602762347');
  });
});

describe('createItem', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should create item', () => {
    let i = 0;
    const expectedValues = [1, 2];
    service.gameObs.subscribe(game => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.items.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.createItem([]);
  });
});

describe('createExit', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should create exit', () => {
    let i = 0;
    const expectedValues = [1, 2];
    service.gameObs.subscribe(game => {
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
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should delete exit', () => {
    let i = 0;
    const exitId = '1735602762347';
    const expectedValues = [1, 0];
    service.gameObs.subscribe(game => {
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
    service.gameObs.subscribe(game => {
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

describe('createProp', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should create prop', () => {
    let i = 0;
    const expectedValues = [1, 2];
    service.gameObs.subscribe(game => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.props.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.createProp([]);
  });
});

describe('deleteProp', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should delete exit', () => {
    let i = 0;
    const propId = 'prop1';
    const expectedValues = [1, 0];
    service.gameObs.subscribe(game => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.props.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.deleteProp(propId);
  });
});

describe('updateProp', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should update exit', () => {
    const prop: GameProp = {
      ...gameMock.content.areas['start'].props[0],
      status: 'on',
    };

    let i = 0;
    service.gameObs.subscribe(game => {
      if (i === 1) {
        const area = game ? game.content.areas['start'] : null;
        const updatedProp = area ? area.props[0] : null;
        if (updatedProp) {
          updatedProp.status = 'on';
        }
        expect(updatedProp).toEqual(prop);
      }
      i += 1;
    });

    service.updateProp(prop);
  });
});

describe('deleteContentVersion', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });

  it('should delete exit', () => {
    let i = 0;
    const exitId = '1735602762347';
    const expectedValues = [1, 0];
    service.gameObs.subscribe(game => {
      const area = game ? game.content.areas['start'] : null;
      expect(area?.exits.length).toEqual(expectedValues[i]);
      i += 1;
    });

    service.deleteExit(exitId);
  });

  it('should issue a command to delete version', fakeAsync(async () => {
    const url = `${versionsApiUrl}?id=abcdefg1234`;
    fetchMock.mockGlobal().delete(
      url,
      { item: gameMock },
      {
        delay: 0,
      }
    );
    service.deleteContentVersion('abcdefg1234');
    expect(service).toBeTruthy();
  }));
});

describe('createContentVersion', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });
  it('should issue a command to create version', fakeAsync(async () => {
    const url = `${versionsApiUrl}`;
    fetchMock.mockGlobal().post(
      url,
      { item: gameMock },
      {
        delay: 0,
      }
    );
    service.createContentVersion();
    tick(10);
    expect(service).toBeTruthy();
  }));
});

describe('getContentVersionsForGame', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });
  it('should get content versions for game', fakeAsync(async () => {
    const url = `${versionsApiUrl}?gameId=MNbCyjAEUk1_4nawe7gD36W4JURzaJwb_hcGn6OZvR0`;
    fetchMock.mockGlobal().get(
      url,
      { items: [gameMock] },
      {
        delay: 0,
      }
    );
    service.getContentVersionsForGame();
    tick();
    const versions = await firstValueFrom(
      service.contentVersionsObs.pipe(skip(1), take(1))
    );
    expect(versions).toEqual([gameMock]);
    fetchMock.unmockGlobal();
  }));
});

describe('loadContentVersion', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
  });
  it('should load content version', fakeAsync(async () => {
    const service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');

    const versionId = 'abcdefg1234';
    const url = `${versionsApiUrl}?id=${versionId}`;
    fetchMock.mockGlobal().get(
      url,
      { item: { content: JSON.stringify(gameMock.content) } },
      {
        delay: 0,
      }
    );
    service.loadContentVersion(versionId);
    tick();
    const newGame = await firstValueFrom(
      service.gameObs.pipe(skip(1), take(1))
    );
    expect(newGame?.content).toEqual(gameMock.content);
    fetchMock.unmockGlobal();
  }));

  it('should get list of props options', () => {
    const service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    const options = service.getPropsListOptions('start');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should get a prop by id', () => {
    const service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    const prop = service.getPropById('prop1', 'start');
    expect(prop?.id).toEqual('prop1');
  });

  it('should get a prop by id - not found', () => {
    const service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    const prop = service.getPropById('prop2', 'start');
    expect(prop?.id).not.toBeDefined();
  });
  it('should get a prop by id - no game', () => {
    const service = TestBed.inject(GameEditorService);
    service.setTestValue(undefined, 'game');
    const prop = service.getPropById('prop2', 'start');
    expect(prop?.id).not.toBeDefined();
  });
});

describe('getCanMapCellBeHidden', () => {
  let service: GameEditorService;
  beforeEach(() => {
    service = TestBed.inject(GameEditorService);
    service.setTestValue(gameMock, 'game');
    service.setTestValue('start', 'selectedAreaId');
    // Locations:
    // prop 2_3
    // item 3_4
    // exit 2_6
    // player 2_2
  });
  it('should determine if map cell can be hidden', () => {
    const canBeHidden = service.getCanMapCellBeHidden('1_1');
    expect(canBeHidden).toBeTrue();
  });
  it('should determine map cell cannot be hidden due to conflict', () => {
    const canBeHidden = service.getCanMapCellBeHidden('3_4');
    expect(canBeHidden).toBeFalse();
  });
  it('should determine map cell cannot be hidden due player start', () => {
    const canBeHidden = service.getCanMapCellBeHidden('2_2');
    expect(canBeHidden).toBeFalse();
  });
});
