import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCellComponent } from './area-cell.component';

describe('AreaCellComponent', () => {
  let component: AreaCellComponent;
  let fixture: ComponentFixture<AreaCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
