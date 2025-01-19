import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPanelItemsComponent } from './editor-panel-items.component';

describe('EditorPanelItemsComponent', () => {
  let component: EditorPanelItemsComponent;
  let fixture: ComponentFixture<EditorPanelItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPanelItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
