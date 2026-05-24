import { ComponentFixture, TestBed } from '@angular/core/testing';
import questMockData from '@app/features/editor/mocks/game.mock';

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
    const gameMock = JSON.parse(JSON.stringify(questMockData));
    component.cover = JSON.stringify(gameMock.content.areas['start']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
