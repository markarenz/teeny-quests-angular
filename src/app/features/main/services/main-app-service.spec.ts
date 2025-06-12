import { fakeAsync, TestBed, tick, flush } from '@angular/core/testing';
import { gamesApiUrl } from '@config/index';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import fetchMock from 'fetch-mock';
import { MainAppService } from './main-app-service';
import { skip, take, first, firstValueFrom } from 'rxjs';

let gameMock = JSON.parse(JSON.stringify(gameMockData));

afterEach(() => {
  TestBed.resetTestingModule();
});

describe('GameEditorService', () => {
  let service: MainAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('toggleMenu', () => {
  let service: MainAppService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainAppService);
  });

  it('should toggle the menu open value', () => {
    let i = 0;
    const expectedResults = [false, true, false];
    service.isMenuOpenObs.subscribe((value) => {
      expect(value).toEqual(expectedResults[i]);
      i += 1;
    });

    // Open
    service.toggleMenu();
    // Close
    service.toggleMenu();

    fetchMock.unmockGlobal();
  });
});

describe('getGamesList', () => {
  let service: MainAppService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainAppService);
  });

  it('should get game by id', fakeAsync(async () => {
    fetchMock.mockGlobal().get(
      gamesApiUrl,
      { items: [gameMock] },
      {
        delay: 0,
      }
    );
    service.getGamesList();
    tick(10);
    const games = await firstValueFrom(service.gamesObs.pipe(skip(1), take(1)));
    expect(games.length).toBe(1);
    fetchMock.unmockGlobal();
  }));
});
