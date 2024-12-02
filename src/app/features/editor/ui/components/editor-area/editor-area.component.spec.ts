import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAreaComponent } from './editor-area.component';

describe('EditorAreaComponent', () => {
  let component: EditorAreaComponent;
  let fixture: ComponentFixture<EditorAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
