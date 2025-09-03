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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
