import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentGameHelpComponent } from './content-game-help.component';

describe('ContentGameHelpComponent', () => {
  let component: ContentGameHelpComponent;
  let fixture: ComponentFixture<ContentGameHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentGameHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentGameHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
