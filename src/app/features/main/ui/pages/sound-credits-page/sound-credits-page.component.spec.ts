// describe('SoundCreditsPageComponent', () => {
//   let component: SoundCreditsPageComponent;
//   let fixture: ComponentFixture<SoundCreditsPageComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [SoundCreditsPageComponent],
//     }).compileComponents();

//     fixture = TestBed.createComponent(SoundCreditsPageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

// ------

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundCreditsPageComponent } from './sound-credits-page.component';
import { provideRouter } from '@angular/router';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

describe('SoundCreditsPageComponent', () => {
  let component: SoundCreditsPageComponent;
  let fixture: ComponentFixture<SoundCreditsPageComponent>;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundCreditsPageComponent, OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        AuthProviderService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(SoundCreditsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
