import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NewGameModalComponent } from './new-game-modal.component';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import gameMockData from '@app/features/editor/mocks/game.mock.json';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';

let service: GameEditorService;

describe('NewGameModalComponent', () => {
  let component: NewGameModalComponent;
  let fixture: ComponentFixture<NewGameModalComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGameModalComponent, OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(NewGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GameEditorService);
    service.updateGame(gameMockData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle input changes', () => {
    const elementDescription = fixture.debugElement.query(
      By.css(`[id="new-game--description"]`)
    );
    elementDescription.nativeElement.value = 'test description';
    fixture.detectChanges();
    const elementTitle = fixture.debugElement.query(
      By.css(`[id="new-game--title"]`)
    );
    elementTitle.nativeElement.value = 'test title';
    fixture.detectChanges();

    component.onBgClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleCancelClick();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
