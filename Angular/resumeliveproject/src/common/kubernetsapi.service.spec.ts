import { TestBed } from '@angular/core/testing';

import { KubernetsapiService } from './kubernetsapi.service';

describe('KubernetsapiService', () => {
  let service: KubernetsapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KubernetsapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
