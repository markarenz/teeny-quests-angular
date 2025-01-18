import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExitDefaultSComponent } from './svg-exit-default-s.component';

describe('SvgExitDefaultSComponent', () => {
  let component: SvgExitDefaultSComponent;
  let fixture: ComponentFixture<SvgExitDefaultSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgExitDefaultSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
