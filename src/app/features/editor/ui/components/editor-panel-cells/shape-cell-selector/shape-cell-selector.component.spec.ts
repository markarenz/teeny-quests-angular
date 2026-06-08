import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeCellSelectorComponent } from './shape-cell-selector.component';

describe('ShapeCellSelectorComponent', () => {
  let component: ShapeCellSelectorComponent;
  let fixture: ComponentFixture<ShapeCellSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeCellSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShapeCellSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
