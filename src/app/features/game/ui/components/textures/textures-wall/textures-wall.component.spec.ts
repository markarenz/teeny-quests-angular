import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexturesWallComponent } from './textures-wall.component';

describe('TexturesWallComponent', () => {
  let component: TexturesWallComponent;
  let fixture: ComponentFixture<TexturesWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TexturesWallComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(TexturesWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
