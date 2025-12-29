import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MainNavComponent } from './main-nav.component';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

describe('MainNavComponent', () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNavComponent],
      providers: [provideRouter([])],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
