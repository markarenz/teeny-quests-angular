import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgActorSlimeGreenComponent } from './svg-actor-slime-green.component';

describe('SvgActorSlimeGreenComponent', () => {
  let component: SvgActorSlimeGreenComponent;
  let fixture: ComponentFixture<SvgActorSlimeGreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgActorSlimeGreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgActorSlimeGreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
