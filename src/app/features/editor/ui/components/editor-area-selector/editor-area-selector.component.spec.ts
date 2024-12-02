import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAreaSelectorComponent } from './editor-area-selector.component';

describe('EditorAreaSelectorComponent', () => {
  let component: EditorAreaSelectorComponent;
  let fixture: ComponentFixture<EditorAreaSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAreaSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorAreaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
