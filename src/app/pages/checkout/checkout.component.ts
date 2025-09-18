import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/products-response.model';
import { ProductStorageService } from '../../services/product-storage.service';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  product: Product | null = null;
  paymentMethod: string = '';
  
  readonly product$: Observable<Product | null>;
  readonly userInfo$: Observable<UserModel | null>;
  
  form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: ProductStorageService,
    private fb: FormBuilder
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
    
    // Verificar parâmetros de query para contribuições diretas
    this.route.queryParams.subscribe(params => {
      if (params['tipo'] && params['valor']) {
        console.log('Contribuição direta detectada:', params);
        this.paymentMethod = 'contribuicao_direta';
        
        // Salvar dados de contribuição no storage
        const contributionData = {
          tipo: params['tipo'],
          valor: parseInt(params['valor'])
        };
        this.storageService.setContributionData(contributionData);
        this.storageService.setPaymentMethod('contribuicao_direta');
        
        console.log('Dados de contribuição salvos:', contributionData);
        // Não precisa de produto para contribuições diretas
        return;
      }
    });
    
    // Verificar se já temos produto no storage
    const currentProduct = this.storageService.getCurrentProduct();
    const currentPaymentMethod = this.storageService.getPaymentMethod();
    
    if (currentProduct) {
      this.product = currentProduct;
      this.paymentMethod = currentPaymentMethod;
      console.log('Produto carregado do storage:', this.product);
      console.log('Método de pagamento:', this.paymentMethod);
    } else if (this.paymentMethod !== 'contribuicao_direta') {
      // Se não tem produto e não é contribuição direta, aguardar um pouco e verificar novamente
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
      
      // Salvar método de pagamento se for contribuição direta
      if (this.paymentMethod === 'contribuicao_direta') {
        this.storageService.setPaymentMethod('contribuicao_direta');
      }
      
      // Navegar para página de finalização em ambos os casos
      this.router.navigate(['/finalizar']);
    }
  }

  goBack() {
    console.log('Voltando para home');
    this.router.navigate(['/']);
  }
}