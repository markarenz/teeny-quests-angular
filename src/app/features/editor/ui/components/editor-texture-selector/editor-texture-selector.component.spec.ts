import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTextureSelectorComponent } from './editor-texture-selector.component';

describe('EditorTextureSelectorComponent', () => {
  let component: EditorTextureSelectorComponent;
  let fixture: ComponentFixture<EditorTextureSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTextureSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorTextureSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
