import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { AreaPropComponent } from './area-prop.component';

describe('AreaPropComponent', () => {
  let component: AreaPropComponent;
  let fixture: ComponentFixture<AreaPropComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaPropComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
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
});
