import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemEmeraldComponent } from './svg-item-emerald.component';

describe('SvgItemEmeraldComponent', () => {
  let component: SvgItemEmeraldComponent;
  let fixture: ComponentFixture<SvgItemEmeraldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemEmeraldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgItemEmeraldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
