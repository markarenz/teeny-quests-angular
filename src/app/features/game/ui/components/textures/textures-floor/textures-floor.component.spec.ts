import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexturesFloorComponent } from './textures-floor.component';

describe('TexturesFloorComponent', () => {
  let component: TexturesFloorComponent;
  let fixture: ComponentFixture<TexturesFloorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TexturesFloorComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(TexturesFloorComponent);
    component = fixture.componentInstance;
    component.floorType = 'default';
    component.isFlat = false;
    component.positionKey = '0_0';
    component.isEditorMode = false;
    component.isHighlighted = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
