import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExitDefaultNComponent } from './svg-exit-default-n.component';

describe('SvgExitDefaultNComponent', () => {
  let component: SvgExitDefaultNComponent;
  let fixture: ComponentFixture<SvgExitDefaultNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultNComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgExitDefaultNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
