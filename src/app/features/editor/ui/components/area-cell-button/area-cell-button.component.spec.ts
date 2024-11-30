import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCellButtonComponent } from './area-cell-button.component';

describe('AreaCellButtonComponent', () => {
  let component: AreaCellButtonComponent;
  let fixture: ComponentFixture<AreaCellButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCellButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaCellButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
