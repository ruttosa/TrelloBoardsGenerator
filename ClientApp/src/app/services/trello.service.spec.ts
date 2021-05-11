import { TestBed } from '@angular/core/testing';

import { TrelloService } from './trello.service';

describe('TrelloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrelloService = TestBed.get(TrelloService);
    expect(service).toBeTruthy();
  });
});
