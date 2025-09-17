import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/products-response.model';
import { ProductStorageService } from '../../services/product-storage.service';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ProductLinkRequest } from '../../models/product-link-request.model';
import { NbDialogService } from '@nebular/theme';
import { ModalPagamentoComponent } from '../../components/modal-pagamento/modal-pagamento.component';
import { VincularUsuarioRequestModel } from '../../models/vincular-usuario-request.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  product: Product | null = null;
  paymentMethod: string = '';
  urlPagamento: string = '';
  
  readonly product$: Observable<Product | null>;
  readonly userInfo$: Observable<UserModel | null>;
  
  form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: ProductStorageService,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private dialogService: NbDialogService
  ) {
    this.product$ = this.storageService.product$;
    this.userInfo$ = this.storageService.userInfo$;
    
    // Criar formulário igual ao modal-presente
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mensagem: ['', []],
    });
  }

  ngOnInit() {
    console.log('Checkout ngOnInit iniciado');
    
    // Verificar se já temos produto no storage
    const currentProduct = this.storageService.getCurrentProduct();
    const currentPaymentMethod = this.storageService.getPaymentMethod();
    
    if (currentProduct) {
      this.product = currentProduct;
      this.paymentMethod = currentPaymentMethod;
      console.log('Produto carregado do storage:', this.product);
      console.log('Método de pagamento:', this.paymentMethod);
    } else {
      // Se não tem produto, aguardar um pouco e verificar novamente
      setTimeout(() => {
        const productAfterDelay = this.storageService.getCurrentProduct();
        if (!productAfterDelay) {
          console.log('Nenhum produto encontrado após delay, redirecionando para home');
          this.router.navigate(['/']);
        } else {
          this.product = productAfterDelay;
          this.paymentMethod = this.storageService.getPaymentMethod();
          console.log('Produto carregado após delay:', this.product);
          console.log('Método de pagamento:', this.paymentMethod);
        }
      }, 1000);
    }

    // Carregar dados do usuário se já existirem
    const currentUser = this.storageService.getCurrentUser();
    if (currentUser) {
      this.form.patchValue(currentUser);
      console.log('Dados do usuário carregados:', currentUser);
    }
  }

  // Método para avançar para finalização (igual ao modal-presente)
  submit() {
    if (this.form.valid) {
      // Salvar dados do usuário no service
      this.storageService.setUser(this.form.value);
      console.log('Dados salvos no storage:', this.form.value);
      
      if (this.paymentMethod === 'link_loja') {
        // Navegar para página de finalização
        this.router.navigate(['/finalizar']);
      } else if (this.paymentMethod === 'pagar_noivos') {
        // Montar link de pagamento com os dados do formulário e mostrar modal
        this.montarLinkPagamento();
      }
    }
  }

  goBack() {
    console.log('Voltando para home');
    this.router.navigate(['/']);
  }

  montarLinkPagamento() {
    if (!this.product) return;
    
    const request: ProductLinkRequest = {
      order_nsu: this.product.id,
      customer: {
        name: this.form.get('nome')?.value || '',
        email: this.form.get('email')?.value || '',
        phone_number: this.form.get('telefone')?.value || ''
      },
      items: [
        {
          quantity: 1,
          price: this.product.valor,
          description: this.product.descricao
        }
      ],
    };
    
    console.log('Gerando link de pagamento:', request);
    
    this.productsService.getLinkPagamento(request).subscribe({
      next: (response) => {
        this.urlPagamento = response.url;
        console.log('Link de pagamento gerado:', this.urlPagamento);
        // Mostrar modal após gerar o link
        this.showPaymentModal();
      },
      error: (error) => {
        console.error('Erro ao gerar link de pagamento:', error);
        alert('Erro ao gerar link de pagamento. Tente novamente.');
      }
    });
  }

  showPaymentModal() {
    this.dialogService.open(ModalPagamentoComponent, {
      hasScroll: false,
      dialogClass: 'modal-size',
      context: {
        urlPagamento: this.urlPagamento,
        product: this.product,
        userData: this.form.value
      }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.goToPaymentNewTab(this.urlPagamento);
      }
    });
  }

  goToPaymentNewTab(url: string) {
    if (!this.isSafeExternalUrl(url)) return;
    // Carregar na mesma janela ao invés de abrir nova aba
    window.location.href = url;
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
}