import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgRidiculopathyComponent } from './svg-ridiculopathy.component';

describe('SvgRidiculopathyComponent', () => {
  let component: SvgRidiculopathyComponent;
  let fixture: ComponentFixture<SvgRidiculopathyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgRidiculopathyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgRidiculopathyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
