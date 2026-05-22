import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemPointyStickComponent } from './svg-item-pointy-stick.component';

describe('SvgItemPointyStickComponent', () => {
  let component: SvgItemPointyStickComponent;
  let fixture: ComponentFixture<SvgItemPointyStickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemPointyStickComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemPointyStickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
