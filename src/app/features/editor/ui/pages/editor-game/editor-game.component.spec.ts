import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorGameComponent } from './editor-game.component';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import fetchMock from 'fetch-mock';

describe('EditorGameComponent', () => {
  let component: EditorGameComponent;
  let fixture: ComponentFixture<EditorGameComponent>;
  let service: GameEditorService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorGameComponent, OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorGameComponent);
    service = TestBed.inject(GameEditorService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fetchMock.unmockGlobal();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle save', () => {
    component.handleSaveClick();
    expect(component.isLoading).toBeTrue();
  });
  it('should handle subnav click', () => {
    component.handleSubNavClick('areas');
    expect(component.subNavCurrent).toBe('areas');
  });

  it('should handle select item', () => {
    component.handleSelectItem('item-1');
    expect(component.subNavCurrent).toBe('items');
  });

  it('should handle select exit', () => {
    component.handleSelectExit('item-1');
    expect(component.subNavCurrent).toBe('exits');
  });

  it('should handle select prop', () => {
    component.handleSelectPanel('prop1');
    expect(component.subNavCurrent).toBe('props');
  });
  it('should handle select map cell', () => {
    component.handleSelectMapCell('5_5');
    expect(component.subNavCurrent).toBe('map');
  });
  it('should handle play click', () => {
    spyOn(router, 'navigate').and.stub();
    component.handlePlayClick();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should handle verions click', () => {
    spyOn(service, 'getContentVersionsForGame').and.resolveTo();
    component.handleContentVersionModalToggle(true);
    expect(service.getContentVersionsForGame).toHaveBeenCalled();
  });
});
