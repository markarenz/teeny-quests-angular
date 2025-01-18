import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExitDefaultWComponent } from './svg-exit-default-w.component';

describe('SvgExitDefaultWComponent', () => {
  let component: SvgExitDefaultWComponent;
  let fixture: ComponentFixture<SvgExitDefaultWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultWComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgExitDefaultWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
