import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInventoryComponent } from './editor-inventory.component';

describe('EditorInventoryComponent', () => {
  let component: EditorInventoryComponent;
  let fixture: ComponentFixture<EditorInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
