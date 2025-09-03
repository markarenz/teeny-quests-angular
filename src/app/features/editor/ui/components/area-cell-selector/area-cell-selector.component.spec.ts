import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCellSelectorComponent } from './area-cell-selector.component';

describe('AreaCellSelectorComponent', () => {
  let component: AreaCellSelectorComponent;
  let fixture: ComponentFixture<AreaCellSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCellSelectorComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(AreaCellSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
