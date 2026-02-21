import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemRubyComponent } from './svg-item-ruby.component';

describe('SvgItemRubyComponent', () => {
  let component: SvgItemRubyComponent;
  let fixture: ComponentFixture<SvgItemRubyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemRubyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgItemRubyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
