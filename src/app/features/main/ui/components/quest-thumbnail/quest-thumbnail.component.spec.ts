import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestThumbnailComponent } from './quest-thumbnail.component';

describe('QuestThumbnailComponent', () => {
  let component: QuestThumbnailComponent;
  let fixture: ComponentFixture<QuestThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestThumbnailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
