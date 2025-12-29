import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
