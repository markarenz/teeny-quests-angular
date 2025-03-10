import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonTextComponent } from './skeleton-text.component';

describe('SkeletonTextComponent', () => {
  let component: SkeletonTextComponent;
  let fixture: ComponentFixture<SkeletonTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
