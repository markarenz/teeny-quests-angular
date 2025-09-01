import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPlayerComponent } from './svg-player.component';

describe('SvgPlayerComponent', () => {
  let component: SvgPlayerComponent;
  let fixture: ComponentFixture<SvgPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPlayerComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
