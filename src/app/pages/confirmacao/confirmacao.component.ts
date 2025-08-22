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
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})

export class ConfirmacaoComponent implements OnInit {
  paymentForm: FormGroup;
  selectedMethod: any;
  productValue: Product | null = null;  
  userValue: UserModel | null = null;

  readonly product$: Observable<Product | null>;
  readonly userInfo$: Observable<UserModel | null>;

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
  textoContinuar: string = "Finalizar";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentFlow: PaymentFlowService,
    private storagePayment: ProductStorageService
  ) {
    this.product$ = this.storagePayment.product$;
    this.userInfo$ = this.storagePayment.userInfo$;
    this.paymentForm = this.fb.group({
      paymentMethod: ['lojas'],
    });

  }

  ngOnInit() {
    this.paymentFlow.clear();
    this.popularDados();
    this.selectMethod('lojas');
  }

  popularDados(){
    this.product$.pipe(take(1))
      .subscribe(p => {
        if (!p) {
          this.router.navigate(['/']);
          return;
        }
        this.productValue = p;
    });

    this.userInfo$.subscribe(user => {
      if(!user){
        this.router.navigate(['/']);
        return
      }
      this.userValue = user;
    })
  }

  get method() {
    return this.paymentForm.get('paymentMethod')!.value;
  }  

  selectMethod(value: string) {
    this.paymentForm.get('paymentMethod')!.setValue(value);
    console.log("Prodct: ", this.productValue)
    console.log("Method: ", this.method);
    if(this.method === "card"){
      console.log("Continuar")
      this.textoContinuar = 'Continuar';
    } else {
      console.log("Finalizar")
      this.textoContinuar = 'Finalizar';
    }
  }

  onContinue() {
    const metodo = this.method;
    console.log('Continuar com método:', this.paymentForm.get('paymentMethod')!.value);
    if (this.method === "card") {
      this.montarLinkPagamento();
    }
    this.router.navigate(['/conclusao']);
  }

  montarLinkPagamento(){
    const linkPagamento = `https://checkout.infinitepay.io/silas-nc?items=[{"name":"${this.productValue?.titulo}","price":${this.productValue?.valor},"quantity":1}]&order_nsu=${this.productValue?.id}&redirect_url=https://silascardoso.com.br/&customer_name=${this.userValue?.nome}&customer_email=${this.userValue?.email}&customer_cellphone=${this.userValue?.telefone}`;
    this.goToPaymentNewTab(linkPagamento);
  }

  goToPaymentNewTab(url: string) {
    if (!this.isSafeExternalUrl(url)) return;
    window.open(url, '_blank', 'noopener,noreferrer'); // evita acesso à sua janela
  }

  private isSafeExternalUrl(url: string): boolean {
    try {
      const u = new URL(url);
      // só permita https e, se quiser, restrinja os domínios:
      const allowedHosts = ['checkout.infinitepay.io'];
      return u.protocol === 'https:' && allowedHosts.includes(u.host);
    } catch {
      return false;
    }
  }

  voltarHome(){
    this.router.navigate(['/']);
  }
  
}
