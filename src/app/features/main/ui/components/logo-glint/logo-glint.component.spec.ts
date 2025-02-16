import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoGlintComponent } from './logo-glint.component';

describe('LogoGlintComponent', () => {
  let component: LogoGlintComponent;
  let fixture: ComponentFixture<LogoGlintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoGlintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoGlintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
