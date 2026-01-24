import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GameComponent } from './game.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import gameMockData from '@app/features/editor/mocks/game.mock';
import { GameROM } from '@app/features/main/interfaces/types';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from '@app/features/game/services/message/message.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let service: GameService;
  let gameMockDataClean: GameROM;
  let router: Router;
  let location: Location;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent, OAuthModule.forRoot(), ToastrModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ToastrService,
        provideNoopAnimations(),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    messageService = TestBed.inject(MessageService);

    gameMockDataClean = await JSON.parse(
      JSON.stringify({
        ...gameMockData,
      })
    );
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameService);
    service.testInit(gameMockDataClean);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close page modal', fakeAsync(async () => {
    let status = await firstValueFrom(service.pageModalStatusObs);
    expect(status).toEqual('intro');
    component.handleHelpClick();
    status = await firstValueFrom(service.pageModalStatusObs);
    expect(status).toEqual('help');
    component.handlePageModalConfirm();
    status = await firstValueFrom(service.pageModalStatusObs);
    expect(status).toEqual('');
    component.handleInfoClick();
    status = await firstValueFrom(service.pageModalStatusObs);
    expect(status).toEqual('intro');
    component.handlePageModalConfirm();
    status = await firstValueFrom(service.pageModalStatusObs);
    expect(status).toEqual('');
    component.handleInventoryClick();
    component.handleInventoryClose();
    expect(status).toEqual('');
  }));

  it('should handle a page URL with a version', fakeAsync(async () => {
    const mockQueryParamsSubject = TestBed.inject(ActivatedRoute)
      .queryParams as BehaviorSubject<any>;
    mockQueryParamsSubject.next({ id: '1234', v: 'abcdefg' });
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    expect(service.gameROMObs).toBeTruthy();
  }));

  it('handleGameEndClick should call router.navigate', fakeAsync(async () => {
    spyOn(router, 'navigate');
    fixture.detectChanges();
    component.handleGameEndClick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
  it('handleToggleFullWidth should call service setYOffset', fakeAsync(async () => {
    spyOn(service, 'setFullWidthYOffsetCurrent');
    fixture.detectChanges();
    component.handleToggleFullWidth();
    expect(service.setFullWidthYOffsetCurrent).toHaveBeenCalled();
  }));
  it('handle window resize', fakeAsync(async () => {
    spyOn(service, 'setAspectRatio');
    fixture.detectChanges();
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1250);

    const mockEvent: Event = {
      //@ts-expect-error
      target: { innerWidth: 1200, innerHeight: 800 },
    };
    component.onResize(mockEvent as unknown as Event);
    expect(service.setAspectRatio).toHaveBeenCalled();
  }));
});
