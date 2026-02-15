import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueShineComponent } from './blue-shine.component';

describe('BlueShineComponent', () => {
  let component: BlueShineComponent;
  let fixture: ComponentFixture<BlueShineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueShineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlueShineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
