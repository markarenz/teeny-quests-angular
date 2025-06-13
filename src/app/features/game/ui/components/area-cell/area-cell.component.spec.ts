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
    component.cellData = {
      x: 2,
      y: 2,
      h: 1,
      floor: 'default',
      wallSouth: 'default',
      wallEast: 'default',
    };
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    component.selectedAreaCellPosition = '3_3';
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });
});
