import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropTorchComponent } from './svg-prop-torch.component';

describe('SvgPropTorchComponent', () => {
  let component: SvgPropTorchComponent;
  let fixture: ComponentFixture<SvgPropTorchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropTorchComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPropTorchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
