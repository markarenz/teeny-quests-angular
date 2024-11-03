import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewGameModalComponent } from './new-game-modal.component';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('NewGameModalComponent', () => {
  let component: NewGameModalComponent;
  let fixture: ComponentFixture<NewGameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGameModalComponent, OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
