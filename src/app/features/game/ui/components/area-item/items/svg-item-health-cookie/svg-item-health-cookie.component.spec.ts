import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemHealthCookieComponent } from './svg-item-health-cookie.component';

describe('SvgItemHealthCookieComponent', () => {
  let component: SvgItemHealthCookieComponent;
  let fixture: ComponentFixture<SvgItemHealthCookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemHealthCookieComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemHealthCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
