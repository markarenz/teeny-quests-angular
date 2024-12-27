import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleCardComponent } from './collapsible-card.component';

describe('CollapsibleCardComponent', () => {
  let component: CollapsibleCardComponent;
  let fixture: ComponentFixture<CollapsibleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollapsibleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
