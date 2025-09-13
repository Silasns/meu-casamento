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
import { ProductsService } from '../../services/products.service';
import { ProductLinkRequest } from '../../models/product-link-request.model';
import { VincularUsuarioRequestModel } from '../../models/vincular-usuario-request.model';

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})

export class ConfirmacaoComponent implements OnInit {
  paymentForm: FormGroup;
  selectedMethod: any;
  productValue!: Product;  
  userValue!: UserModel;
  urlPagamento: string = '';
  cardErro: boolean = false;

  readonly product$: Observable<Product | null>;
  readonly userInfo$: Observable<UserModel | null>;

  methods = [
    { value: 'lojas', label: 'Comprar diretamente na Loja',      icon: 'shopping-bag-outline' },
    { value: 'card',  label: 'PIX ou CARTÃO. Envie o valor do produto diretamente para nós.',     icon: 'credit-card-outline' },
  ];

  textoContinuar: string = "Finalizar";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentFlow: PaymentFlowService,
    private storagePayment: ProductStorageService,
    private productsService: ProductsService
  ) {
    this.product$ = this.storagePayment.product$;
    this.userInfo$ = this.storagePayment.userInfo$;
    this.paymentForm = this.fb.group({
      paymentMethod: ['lojas'],
    });

  }

  ngOnInit() {
    //this.paymentFlow.clear();
    this.popularDados();
    this.selectMethod('lojas');
    this.montarLinkPagamento();
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
    this.selectedMethod = value;
    this.paymentForm.get('paymentMethod')!.setValue(value);
    if(this.method === "card"){
      this.textoContinuar = 'Continuar';
    } else {
      this.textoContinuar = 'Finalizar';
    }
  }

  onContinue() {
    const metodo = this.method;
    if (this.method === "card") {
      this.goToPaymentNewTab(this.urlPagamento);
      console.log("Metodo pagamento1: ", this.method);
    } else if(this.method === "lojas") {
       this.vincularUsuarioReservarProduto();
    }
    
  }

  montarLinkPagamento(){
    const request: ProductLinkRequest = {
      order_nsu: this.productValue.id,
      customer: {
        name: this.userValue.nome,
        email: this.userValue.email,
        phone_number: this.userValue.telefone
      },
      items: [
        {
          quantity: 1,
          price: this.productValue.valor,
          description: this.productValue.descricao
        }
      ],
    }
    this.productsService.getLinkPagamento(request).subscribe(response => {
      this.urlPagamento = response.url;
    })
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

  goToConfirmacao() {
    console.log('go to conclusao')
    this.router.navigate(['/conclusao']);
  }

  atualizarReservaProduto() {
    const request = {"reservado": true}
    console.log("Id: ", this.productValue.id)
    this.productsService.patchProduto(this.productValue.id, request).subscribe({
      next: (response) => {
        this.goToConfirmacao();
      },
      error: (error) => {
        this.cardErro = true;
        console.error('Erro ao reservar produto:', error);
      }
    });
  }

  vincularUsuarioReservarProduto() {
    const request: VincularUsuarioRequestModel = {
        nome: this.userValue.nome,
        telefone: this.userValue.telefone,
        email: this.userValue.email,
        mensagem: this.userValue.mensagem,
        produtoId: this.productValue.id,
        meioReserva: this.method
    };
    this.productsService.postVinculaProdutoUsuario(request).subscribe({
      next: (response) => {
        this.goToConfirmacao();
      },
      error: (error) => {
        this.cardErro = true;
      }
    })
  }
  
}
