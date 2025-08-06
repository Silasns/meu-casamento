import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmationGuard } from './confirmation.guard';

describe('confirmationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
