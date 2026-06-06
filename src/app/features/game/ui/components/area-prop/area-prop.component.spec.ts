import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { AreaPropComponent } from './area-prop.component';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

describe('AreaPropComponent', () => {
  let component: AreaPropComponent;
  let fixture: ComponentFixture<AreaPropComponent>;
  let mockEventEmitter: EventEmitter<string>;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaPropComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(AreaPropComponent);
    component = fixture.componentInstance;
    component.isClickable = true;
    component.isEditorMode = true;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle click', () => {
    component.onClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleClick();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });

  it('should refresh position when h changes in place', () => {
    component.prop = {
      ...component.prop,
      x: 3,
      y: 1,
      h: 8,
    };
    fixture.detectChanges();

    const initialBottom = component.position.bottom;
    component.prop.h = 13;

    fixture.detectChanges();

    expect(component.position.bottom).not.toEqual(initialBottom);
  });
});
