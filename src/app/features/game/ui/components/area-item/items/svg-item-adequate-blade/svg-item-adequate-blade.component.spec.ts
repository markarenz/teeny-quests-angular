import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemAdequateBladeComponent } from './svg-item-adequate-blade.component';

describe('SvgItemAdequateBladeComponent', () => {
  let component: SvgItemAdequateBladeComponent;
  let fixture: ComponentFixture<SvgItemAdequateBladeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemAdequateBladeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemAdequateBladeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
