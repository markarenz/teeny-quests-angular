import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavaComponent } from './lava.component';

describe('LavaComponent', () => {
  let component: LavaComponent;
  let fixture: ComponentFixture<LavaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LavaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
