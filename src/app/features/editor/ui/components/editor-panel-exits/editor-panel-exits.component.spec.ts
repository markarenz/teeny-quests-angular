import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPanelExitsComponent } from './editor-panel-exits.component';

describe('EditorPanelExitsComponent', () => {
  let component: EditorPanelExitsComponent;
  let fixture: ComponentFixture<EditorPanelExitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanelExitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPanelExitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
