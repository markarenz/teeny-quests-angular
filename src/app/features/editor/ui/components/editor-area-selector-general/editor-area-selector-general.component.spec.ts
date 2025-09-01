import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAreaSelectorGeneralComponent } from './editor-area-selector-general.component';

describe('EditorAreaSelectorGeneralComponent', () => {
  let component: EditorAreaSelectorGeneralComponent;
  let fixture: ComponentFixture<EditorAreaSelectorGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAreaSelectorGeneralComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorAreaSelectorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
