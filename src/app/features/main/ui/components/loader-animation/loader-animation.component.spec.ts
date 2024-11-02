import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderAnimationComponent } from './loader-animation.component';

describe('LoaderAnimationComponent', () => {
  let component: LoaderAnimationComponent;
  let fixture: ComponentFixture<LoaderAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
