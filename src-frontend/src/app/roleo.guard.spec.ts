import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleoGuard } from './roleo.guard';

describe('roleoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
