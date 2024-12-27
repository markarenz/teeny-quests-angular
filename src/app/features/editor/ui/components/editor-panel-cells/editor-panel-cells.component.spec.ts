import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPanelCellsComponent } from './editor-panel-cells.component';

describe('EditorPanelCellsComponent', () => {
  let component: EditorPanelCellsComponent;
  let fixture: ComponentFixture<EditorPanelCellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelCellsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPanelCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
