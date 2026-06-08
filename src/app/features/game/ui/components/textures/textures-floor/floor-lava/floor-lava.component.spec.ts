import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorLavaComponent } from './floor-lava.component';

describe('FloorLavaComponent', () => {
  let component: FloorLavaComponent;
  let fixture: ComponentFixture<FloorLavaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorLavaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FloorLavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
