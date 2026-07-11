import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EditorHowToComponent } from './editor-how-to.component';
import { of } from 'rxjs';

describe('EditorHowToComponent', () => {
  let component: EditorHowToComponent;
  let fixture: ComponentFixture<EditorHowToComponent>;

  const mockActivatedRoute = {
    paramMap: of({ get: (key: string) => 'testValue' }),
    // ... other properties you might need to mock
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorHowToComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorHowToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
