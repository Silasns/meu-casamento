import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { ProductStorageService } from '../../services/product-storage.service';

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrl: './conclusao.component.scss'
})
export class ConclusaoComponent implements OnInit {

  constructor(
    private router: Router,
    private paymentFlow: PaymentFlowService,
    private paymentStorage: ProductStorageService
  ) {}

  ngOnInit() {
    this.paymentStorage.clear()
    this.paymentFlow.clear();
  }

  voltarHome() {
    this.router.navigate(['/']);
  }
}
