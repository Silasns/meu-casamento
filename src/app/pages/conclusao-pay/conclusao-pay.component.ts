import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { ProductStorageService } from '../../services/product-storage.service';

@Component({
  selector: 'app-conclusao-pay',
  templateUrl: './conclusao-pay.component.html',
  styleUrl: './conclusao-pay.component.scss'
})
export class ConclusaoPayComponent {

  constructor(
    private router: Router,
    private paymentFlow: PaymentFlowService,
    private paymentStorage: ProductStorageService
  ) {}

  voltarHome() {
    this.paymentStorage.clear();
    this.paymentFlow.clear();
    this.router.navigate(['/']);
  }
}
