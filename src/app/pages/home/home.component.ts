import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { ProductStorageService } from '../../services/product-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: any = [];
  showWelcomeModal: boolean = true;

  constructor(
    private productService: ProductsService,
    private paymentFlow: PaymentFlowService,
    private paymentStorage: ProductStorageService
  ){}

  ngOnInit(): void {
    this.paymentStorage.clear()
    this.paymentFlow.clear();
    this.getProdutcs();
  }

  closeWelcomeModal(): void {
    this.showWelcomeModal = false;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeWelcomeModal();
    }
  }

  getProdutcs(){
    this.productService.getProducts().subscribe({
      next: (listProducts) => {
        this.products = listProducts;
      },
      error: (err) => {
      }
    })
  }
}
