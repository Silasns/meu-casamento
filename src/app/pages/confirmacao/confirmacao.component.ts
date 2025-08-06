import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MethodModel } from '../../models/method.model';
import { Router } from '@angular/router';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { Product } from '../../models/products-response.model';
import { ModalPresenteComponent } from '../../components/modal-presente/modal-presente.component';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ProductStorageService } from '../../services/product-storage.service';
import { filter, Observable, take } from 'rxjs';

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})

export class ConfirmacaoComponent implements OnInit {
  paymentForm: FormGroup;
  selectedMethod: any;
  productValue: Product | null = null;  

  readonly product$: Observable<Product | null>;

  methods = [
    { value: 'lojas', label: 'Comprar diretamente na Loja',      icon: 'shopping-bag-outline' },
    { value: 'pix',   label: 'Pix',        icon: '' },
    { value: 'card',  label: 'Cartão',     icon: 'credit-card-outline' },
  ];

  valorProdutos = 4711.08;
  desconto = 235.56;
  frete = 41.78;
  valorBoleto = 4517.30;
  economia = 235.56;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentFlow: PaymentFlowService,
    private storagePayment: ProductStorageService
  ) {
    this.product$ = this.storagePayment.product$;
    this.paymentForm = this.fb.group({
      paymentMethod: ['lojas'],
    });

  }

  ngOnInit() {
    this.paymentFlow.clear();
    this.product$.pipe(take(1))
      .subscribe(p => {
        if (!p) {
          this.router.navigate(['/']);
          return;
        }
        this.productValue = p;
      });
  }
  get method() {
    return this.paymentForm.get('paymentMethod')!.value;
  }

  selectMethod(value: string) {
    this.paymentForm.get('paymentMethod')!.setValue(value);
    console.log("Prodct: ", this.productValue)
  }

  onContinue() {
    const metodo = this.method;
    // aqui faz o que precisa com o método: envio, navegação, API, etc.
    console.log('Continuar com método:', this.paymentForm.get('paymentMethod')!.value);
    // exemplo: emitir evento ou chamar serviço
    this.router.navigate(['/conclusao']);
  }

  voltarHome(){
    this.router.navigate(['/']);
  }
  
}
