import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { AreaExitComponent } from './area-exit.component';

describe('AreaExitComponent', () => {
  let component: AreaExitComponent;
  let fixture: ComponentFixture<AreaExitComponent>;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaExitComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(AreaExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
