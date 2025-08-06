import { TestBed } from '@angular/core/testing';

import { PaymentFlowService } from './payment-flow.service';

describe('PaymentFlowService', () => {
  let service: PaymentFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
