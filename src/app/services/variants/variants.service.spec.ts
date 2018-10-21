import { TestBed, inject } from '@angular/core/testing';

import { VariantsService } from './variants.service';

describe('VariantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VariantsService]
    });
  });

  it('should be created', inject([VariantsService], (service: VariantsService) => {
    expect(service).toBeTruthy();
  }));
});
