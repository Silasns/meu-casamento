import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductStorageService } from '../../services/product-storage.service';
import { Product } from '../../models/products-response.model';
import { UserModel } from '../../models/user.model';
import { ProductsService } from '../../services/products.service';
import { VincularUsuarioRequestModel } from '../../models/vincular-usuario-request.model';
import { ProductLinkRequest } from '../../models/product-link-request.model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrl: './finalizar.component.scss'
})
export class FinalizarComponent implements OnInit {
  product: Product | null = null;
  userData: UserModel | null = null;
  paymentMethod: string = '';
  confirmReservation = false;
  cardErro = false;
  produtoIndisponivel = false;
  method = 'lojas'; // Método para reserva via lojas (igual ao usado na confirmação)
  urlPagamento: string = '';
  isLoadingPayment = false;
  
  readonly product$: Observable<Product | null>;
  readonly userInfo$: Observable<UserModel | null>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: ProductStorageService,
    private productsService: ProductsService,
    private validationService: ValidationService
  ) {
    this.product$ = this.storageService.product$;
    this.userInfo$ = this.storageService.userInfo$;
  }

  ngOnInit() {    
    // Verificar se a reserva já foi concluída
    if (this.storageService.getReservationCompleted()) {
      this.router.navigate(['/conclusao']);
      return;
    }
    
    // Carregar produto, dados do usuário e método de pagamento
    const currentProduct = this.storageService.getCurrentProduct();
    const currentUser = this.storageService.getCurrentUser();
    const currentPaymentMethod = this.storageService.getPaymentMethod();
    
    // Verificar se é contribuição direta (sem produto)
    if (currentPaymentMethod === 'contribuicao_direta') {
      this.product = null; // Não há produto para contribuições diretas
      this.userData = currentUser;
      this.paymentMethod = currentPaymentMethod;
      this.method = 'contribuicaoDireta';
      // Gerar link de pagamento para contribuição direta
      this.gerarLinkPagamentoContribuicao(); // verificar o geração do link de pagamento TODO
      return;
    }
    
    if (!currentProduct) {
      this.router.navigate(['/']);
      return;
    }
    
    this.product = currentProduct;
    this.userData = currentUser;
    this.paymentMethod = currentPaymentMethod;
    
    // Definir método baseado no tipo de pagamento
    if (this.paymentMethod === 'pagar_noivos') {
      this.method = 'pagamentoDireto';
      // Gerar link de pagamento automaticamente
      this.gerarLinkPagamento();
    } else {
      this.method = 'lojas';
    }
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
    });
  }

  gerarLinkPagamento() {
    if (!this.product || !this.userData) return;
    
    this.resetErrorFlags();
    this.isLoadingPayment = true;
    
    // Validar disponibilidade do produto antes de gerar link
    this.validarDisponibilidadeProduto().then(isAvailable => {
      if (!isAvailable) {
        this.isLoadingPayment = false;
        this.cardErro = true;
        this.produtoIndisponivel = true;
        console.error('Produto não está mais disponível');
        return;
      }
      
      // Produto disponível, gerar link de pagamento
      this.gerarLinkPagamentoSeguro();
    }).catch(error => {
      console.error('Erro ao validar disponibilidade:', error);
      this.isLoadingPayment = false;
      this.cardErro = true;
      this.produtoIndisponivel = true;
    });
  }

  private validarDisponibilidadeProduto(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.product) {
        reject(new Error('Produto não encontrado'));
        return;
      }
      
      const id: string = this.product.id;

      this.validationService.validateProductAvailability(id).subscribe({
        next: (isAvailable) => {
          resolve(isAvailable);
        },
        error: (error) => {
          console.error('Erro ao validar disponibilidade:', error);
          // Em caso de erro na API, também considerar como produto indisponível
          this.cardErro = true;
          this.produtoIndisponivel = true;
          this.isLoadingPayment = false;
          resolve(false);
        }
      });
    });
  }

  private gerarLinkPagamentoSeguro() {
    if (!this.product || !this.userData) return;
    
    const request: ProductLinkRequest = {
      order_nsu: this.validationService.generateUniqueTransactionId(`${this.product.id}`),
      customer: {
        name: this.userData.nome,
        email: this.userData.email,
        phone_number: this.userData.telefone
      },
      items: [
        {
          quantity: 1,
          price: this.product.valor,
          description: this.product.titulo
        }
      ],
    };
    
    this.productsService.getLinkPagamento(request).subscribe({
      next: (response) => {
        this.urlPagamento = response.url;
        this.isLoadingPayment = false;
      },
      error: (error) => {
        this.isLoadingPayment = false;
        this.cardErro = true;
      }
    });
  }

  gerarLinkPagamentoContribuicao() {
    if (!this.userData) return;
    
    this.isLoadingPayment = true;
    this.cardErro = false;
    
    // Buscar dados de contribuição do storage
    const contributionData = this.storageService.getContributionData();
    
    if (!contributionData) {
      console.error('Dados de contribuição não encontrados');
      this.isLoadingPayment = false;
      this.cardErro = true;
      return;
    }
    
    const request: ProductLinkRequest = {
      order_nsu: this.validationService.generateUniqueTransactionId(`contribuicao_${contributionData.tipo}`),
      customer: {
        name: this.userData!.nome,
        email: this.userData!.email,
        phone_number: this.userData!.telefone
      },
      items: [
        {
          quantity: 1,
          price: contributionData.valor,
          description: contributionData.tipo === 'noivos' ? 'Contribuição para o enxoval dos noivos' : 'Contribuição para lua de mel' // TODO retirar o contribuição lua de mel
        }
      ],
    };
  
    
    this.productsService.getLinkPagamento(request).subscribe({
      next: (response) => {
        this.urlPagamento = response.url;
        this.isLoadingPayment = false;
      },
      error: (error) => {
        this.isLoadingPayment = false;
        this.cardErro = true;
      }
    });
  }

  finalizeReservation() {
    if (this.paymentMethod === 'pagar_noivos') {
      // Para pagamento direto, salvar reserva e ir para pagamento
      this.confirmarPagamento();
    } else if (this.paymentMethod === 'contribuicao_direta') {
      // Para contribuição direta, ir para pagamento
      this.confirmarPagamentoContribuicao();
    } else {
      // Para link de loja, finalizar reserva normalmente
      if (this.confirmReservation && this.product && this.userData) {
        this.vincularUsuarioReservarProduto();
      }
    }
  }

  confirmarPagamento() {
    if (!this.product || !this.userData) {
      return;
    }

    this.isLoadingPayment = true;
    this.cardErro = false;

    // Salvar a reserva no banco antes de redirecionar
    this.vincularUsuarioReservarProdutoPagamento();
  }

  confirmarPagamentoContribuicao() {
    if (!this.userData) {
      return;
    }

    if (!this.urlPagamento) {
      return;
    }
    
    // Para contribuições diretas, não precisamos salvar no banco
    // Apenas redirecionar para o pagamento
    this.goToPayment(this.urlPagamento);
  }

  vincularUsuarioReservarProdutoPagamento() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      this.isLoadingPayment = false;
      return;
    }

    const request: VincularUsuarioRequestModel = {
      nome: this.userData.nome,
      telefone: this.userData.telefone,
      email: this.userData.email,
      mensagem: this.userData.mensagem,
      produtoId: this.product.id,
      meioReserva: 'pagamentoDireto' // Valor correto do enum do backend
    };

    this.productsService.postVinculaProdutoUsuario(request).subscribe({
      next: (response) => {
        this.isLoadingPayment = false;
        // Limpar dados após pagamento bem-sucedido
        this.storageService.clearAfterPayment();
        // Após salvar a reserva, redirecionar para pagamento
        this.goToPayment(this.urlPagamento);
      },
      error: (error) => {
        this.isLoadingPayment = false;
        this.cardErro = true;
      }
    });
  }

  goToPayment(url: string) {
    if (!this.validationService.validateSafeUrl(url)) {
      console.error('URL não é segura para redirecionamento:', url);
      this.cardErro = true;
      return;
    }
    // Carregar na mesma janela ao invés de abrir nova aba
    window.location.href = url;
  }

  vincularUsuarioReservarProduto() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      return;
    }

    // Validar disponibilidade antes de finalizar reserva
    this.validarDisponibilidadeProduto().then(isAvailable => {
      if (!isAvailable) {
        this.cardErro = true;
        this.produtoIndisponivel = true;
        console.error('Produto não está mais disponível para reserva');
        return;
      }
      
      // Produto disponível, prosseguir com a reserva
      this.processarReservaProduto();
    }).catch(error => {
      console.error('Erro ao validar disponibilidade:', error);
      this.cardErro = true;
      this.produtoIndisponivel = true;
    });
  }

  private processarReservaProduto() {
    if (!this.product || !this.userData) return;

    const request: VincularUsuarioRequestModel = {
      nome: this.userData.nome,
      telefone: this.userData.telefone,
      email: this.userData.email,
      mensagem: this.userData.mensagem,
      produtoId: this.product.id,
      meioReserva: this.method
    };

    this.productsService.postVinculaProdutoUsuario(request).subscribe({
      next: (response) => {
        // Marcar reserva como concluída antes de navegar
        this.storageService.setReservationCompleted(true);
        // Limpar dados após reserva bem-sucedida
        this.storageService.clearAfterReservation();
        this.router.navigate(['/conclusao']);
      },
      error: (error) => {
        this.cardErro = true;
      }
    });
  }

  getContributionValue(): number {
    // Buscar o valor da contribuição do storage
    const contributionData = this.storageService.getContributionData();
    if (contributionData) {
      return contributionData.valor / 100; // Converter de centavos para reais
    }
    return 0;
  }

  goBack() {
    this.router.navigate(['/checkout']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  // Método para resetar flags de erro antes de novas tentativas
  private resetErrorFlags(): void {
    this.cardErro = false;
    this.produtoIndisponivel = false;
  }
}