import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaExitComponent } from './area-exit.component';

describe('AreaExitComponent', () => {
  let component: AreaExitComponent;
  let fixture: ComponentFixture<AreaExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaExitComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(AreaExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
