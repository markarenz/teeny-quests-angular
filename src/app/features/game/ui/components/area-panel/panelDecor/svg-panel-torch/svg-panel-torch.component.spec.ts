import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPanelTorchComponent } from './svg-panel-torch.component';

describe('SvgPanelTorchComponent', () => {
  let component: SvgPanelTorchComponent;
  let fixture: ComponentFixture<SvgPanelTorchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPanelTorchComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPanelTorchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
