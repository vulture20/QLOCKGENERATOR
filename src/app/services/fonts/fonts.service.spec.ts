import { TestBed, inject } from '@angular/core/testing';

import { FontsService } from './fonts.service';

describe('FontsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FontsService]
    });
  });

  it('should be created', inject([FontsService], (service: FontsService) => {
    expect(service).toBeTruthy();
  }));
});
