import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPanelInfoComponent } from './editor-panel-info.component';

describe('EditorPanelInfoComponent', () => {
  let component: EditorPanelInfoComponent;
  let fixture: ComponentFixture<EditorPanelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPanelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
