import { TestBed } from '@angular/core/testing';

import { ApifyAllService } from './apify-all.service';

describe('ApifyAllService', () => {
  let service: ApifyAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApifyAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
