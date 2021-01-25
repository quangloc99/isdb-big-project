import { TestBed } from '@angular/core/testing';

import { DetailInfoObserverService } from './detail-remain.service';

describe('DetailRemainService', () => {
  let service: DetailInfoObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailInfoObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
