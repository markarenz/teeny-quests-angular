import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemHealthPotionComponent } from './svg-item-health-potion.component';

describe('SvgItemHealthPotionComponent', () => {
  let component: SvgItemHealthPotionComponent;
  let fixture: ComponentFixture<SvgItemHealthPotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemHealthPotionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemHealthPotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
