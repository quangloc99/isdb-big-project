import { TestBed } from '@angular/core/testing';

import { CurrentUserInfoObserver } from './current-user-info-observer.service';

describe('CurrentUserInfoObserverService', () => {
  let service: CurrentUserInfoObserver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentUserInfoObserver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
