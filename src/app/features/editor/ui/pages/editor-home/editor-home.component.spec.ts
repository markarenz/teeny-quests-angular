import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorHomeComponent } from './editor-home.component';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EditorHomeComponent', () => {
  let component: EditorHomeComponent;
  let fixture: ComponentFixture<EditorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorHomeComponent, OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
