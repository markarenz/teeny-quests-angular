import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorGameComponent } from './editor-game.component';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('EditorGameComponent', () => {
  let component: EditorGameComponent;
  let fixture: ComponentFixture<EditorGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorGameComponent, OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
