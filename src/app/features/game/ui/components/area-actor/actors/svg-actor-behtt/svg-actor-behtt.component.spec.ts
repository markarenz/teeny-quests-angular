import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgActorBehttComponent } from './svg-actor-behtt.component';

describe('SvgActorBehttComponent', () => {
  let component: SvgActorBehttComponent;
  let fixture: ComponentFixture<SvgActorBehttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgActorBehttComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgActorBehttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
