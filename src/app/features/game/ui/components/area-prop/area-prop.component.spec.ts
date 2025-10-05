import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaPropComponent } from './area-prop.component';

describe('AreaPropComponent', () => {
  let component: AreaPropComponent;
  let fixture: ComponentFixture<AreaPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaPropComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(AreaPropComponent);
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
