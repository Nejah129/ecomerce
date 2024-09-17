import { TestBed } from '@angular/core/testing';

import { GeoNamesService } from './geo-names.service';

describe('GeoNamesService', () => {
  let service: GeoNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
