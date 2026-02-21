import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgShadowComponent } from './svg-shadow.component';

describe('SvgShadowComponent', () => {
  let component: SvgShadowComponent;
  let fixture: ComponentFixture<SvgShadowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgShadowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
