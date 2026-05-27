import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemRingProtectionComponent } from './svg-item-ring-protection.component';

describe('SvgItemRingProtectionComponent', () => {
  let component: SvgItemRingProtectionComponent;
  let fixture: ComponentFixture<SvgItemRingProtectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemRingProtectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemRingProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
