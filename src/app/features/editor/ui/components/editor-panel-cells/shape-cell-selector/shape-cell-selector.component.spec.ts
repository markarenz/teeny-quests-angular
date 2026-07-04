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

  it('should toggle shape select', () => {
    expect(component.isOpen).toBe(false);
    component.handleToggleShapeSelect();
    expect(component.isOpen).toBe(true);
    component.handleToggleShapeSelect();
    expect(component.isOpen).toBe(false);
  });
  it('should handle shape option select', () => {
    spyOn(component.handleShapeSelect, 'emit');
    const option = 'Ring-7';
    component.handleShapeOptionSelect(option);
    expect(component.handleShapeSelect.emit).toHaveBeenCalled();
  });
});
