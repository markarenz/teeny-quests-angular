import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorExitsComponent } from './editor-exits.component';

describe('EditorExitsComponent', () => {
  let component: EditorExitsComponent;
  let fixture: ComponentFixture<EditorExitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorExitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorExitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
