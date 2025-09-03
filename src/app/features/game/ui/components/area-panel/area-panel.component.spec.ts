import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaPanelComponent } from './area-panel.component';

describe('AreaPanelComponent', () => {
  let component: AreaPanelComponent;
  let fixture: ComponentFixture<AreaPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaPanelComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(AreaPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
