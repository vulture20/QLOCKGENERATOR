import { TestBed } from '@angular/core/testing';

import { PlacementsService } from './placements.service';

describe('PlacementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacementsService = TestBed.get(PlacementsService);
    expect(service).toBeTruthy();
  });
});
