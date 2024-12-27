import { TestBed } from '@angular/core/testing';

import { GameEditorServiceService } from './game-editor-service.service';

describe('GameEditorServiceService', () => {
  let service: GameEditorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEditorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
