import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHudComponent } from './health-hud.component';

describe('HealthHudComponent', () => {
  let component: HealthHudComponent;
  let fixture: ComponentFixture<HealthHudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthHudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
