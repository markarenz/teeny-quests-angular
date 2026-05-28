import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgActorSkelloComponent } from './svg-actor-skello.component';

describe('SvgActorSkelloComponent', () => {
  let component: SvgActorSkelloComponent;
  let fixture: ComponentFixture<SvgActorSkelloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgActorSkelloComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgActorSkelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
