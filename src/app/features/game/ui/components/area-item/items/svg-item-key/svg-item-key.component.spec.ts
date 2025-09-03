import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemKeyComponent } from './svg-item-key.component';

describe('SvgItemKeyComponent', () => {
  let component: SvgItemKeyComponent;
  let fixture: ComponentFixture<SvgItemKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemKeyComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
