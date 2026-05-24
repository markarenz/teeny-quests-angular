import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemHealthContainerComponent } from './svg-item-health-container.component';

describe('SvgItemHealthContainerComponent', () => {
  let component: SvgItemHealthContainerComponent;
  let fixture: ComponentFixture<SvgItemHealthContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemHealthContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemHealthContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
