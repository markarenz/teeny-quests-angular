import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInputActionsComponent } from './editor-input-actions.component';

describe('EditorInputActionsComponent', () => {
  let component: EditorInputActionsComponent;
  let fixture: ComponentFixture<EditorInputActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInputActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorInputActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
