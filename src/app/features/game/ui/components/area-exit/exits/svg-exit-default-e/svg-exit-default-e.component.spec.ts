import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExitDefaultEComponent } from './svg-exit-default-e.component';

describe('SvgExitDefaultEComponent', () => {
  let component: SvgExitDefaultEComponent;
  let fixture: ComponentFixture<SvgExitDefaultEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgExitDefaultEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
