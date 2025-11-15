import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AboutPageComponent } from './about-page.component';
import { of } from 'rxjs';

describe('AboutPageComponent', () => {
  let component: AboutPageComponent;
  let fixture: ComponentFixture<AboutPageComponent>;

  const mockActivatedRoute = {
    paramMap: of({ get: (key: string) => 'testValue' }),
    // ... other properties you might need to mock
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
