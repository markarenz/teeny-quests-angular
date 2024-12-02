import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCellModalComponent } from './area-cell-modal.component';

describe('AreaCellModalComponent', () => {
  let component: AreaCellModalComponent;
  let fixture: ComponentFixture<AreaCellModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCellModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaCellModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
