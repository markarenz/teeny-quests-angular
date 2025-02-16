import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoMainComponent } from './logo-main.component';

describe('LogoMainComponent', () => {
  let component: LogoMainComponent;
  let fixture: ComponentFixture<LogoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
