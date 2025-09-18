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
    console.log('Finalizar ngOnInit iniciado');
    
    // Verificar se a reserva já foi concluída
    if (this.storageService.getReservationCompleted()) {
      console.log('Reserva já foi concluída, redirecionando para conclusão');
      this.router.navigate(['/conclusao']);
      return;
    }
    
    // Carregar produto, dados do usuário e método de pagamento
    const currentProduct = this.storageService.getCurrentProduct();
    const currentUser = this.storageService.getCurrentUser();
    const currentPaymentMethod = this.storageService.getPaymentMethod();
    
    // Verificar se é contribuição direta (sem produto)
    if (currentPaymentMethod === 'contribuicao_direta') {
      console.log('Contribuição direta detectada');
      this.product = null; // Não há produto para contribuições diretas
      this.userData = currentUser;
      this.paymentMethod = currentPaymentMethod;
      this.method = 'contribuicaoDireta';
      // Gerar link de pagamento para contribuição direta
      this.gerarLinkPagamentoContribuicao(); // verificar o geração do link de pagamento TODO
      return;
    }
    
    if (!currentProduct) {
      console.log('Nenhum produto encontrado, redirecionando para home');
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
    
    console.log('Produto carregado:', this.product);
    console.log('Dados do usuário:', this.userData);
    console.log('Método de pagamento:', this.paymentMethod);
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      console.log('Link copiado:', link);
    });
  }

  gerarLinkPagamento() {
    if (!this.product || !this.userData) return;
    
    this.isLoadingPayment = true;
    this.cardErro = false;
    
    // Validar disponibilidade do produto antes de gerar link
    this.validarDisponibilidadeProduto().then(isAvailable => {
      if (!isAvailable) {
        this.isLoadingPayment = false;
        this.cardErro = true;
        console.error('Produto não está mais disponível');
        return;
      }
      
      // Produto disponível, gerar link de pagamento
      this.gerarLinkPagamentoSeguro();
    }).catch(error => {
      console.error('Erro ao validar disponibilidade:', error);
      this.isLoadingPayment = false;
      this.cardErro = true;
    });
  }

  private validarDisponibilidadeProduto(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.product) {
        reject(new Error('Produto não encontrado'));
        return;
      }
      
      this.validationService.validateProductAvailability(this.product.id).subscribe({
        next: (isAvailable) => {
          console.log(`Produto ${this.product?.id} disponível:`, isAvailable);
          resolve(isAvailable);
        },
        error: (error) => {
          console.error('Erro ao validar disponibilidade:', error);
          reject(error);
        }
      });
    });
  }

  private gerarLinkPagamentoSeguro() {
    if (!this.product || !this.userData) return;
    
    const request: ProductLinkRequest = {
      order_nsu: this.validationService.generateUniqueTransactionId(`produto_${this.product.id}`),
      customer: {
        name: this.userData.nome,
        email: this.userData.email,
        phone_number: this.userData.telefone
      },
      items: [
        {
          quantity: 1,
          price: this.product.valor,
          description: this.product.descricao
        }
      ],
    };
    
    console.log('Gerando link de pagamento seguro:', request);
    
    this.productsService.getLinkPagamento(request).subscribe({
      next: (response) => {
        this.urlPagamento = response.url;
        this.isLoadingPayment = false;
        console.log('Link de pagamento gerado:', this.urlPagamento);
      },
      error: (error) => {
        console.error('Erro ao gerar link de pagamento:', error);
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
    
    console.log('Gerando link de pagamento para contribuição:', request);
    
    this.productsService.getLinkPagamento(request).subscribe({
      next: (response) => {
        this.urlPagamento = response.url;
        this.isLoadingPayment = false;
        console.log('Link de pagamento gerado:', this.urlPagamento);
      },
      error: (error) => {
        console.error('Erro ao gerar link de pagamento:', error);
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
        console.log('Finalizando reserva...');
        this.vincularUsuarioReservarProduto();
      }
    }
  }

  confirmarPagamento() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      return;
    }

    this.isLoadingPayment = true;
    this.cardErro = false;

    // Salvar a reserva no banco antes de redirecionar
    this.vincularUsuarioReservarProdutoPagamento();
  }

  confirmarPagamentoContribuicao() {
    if (!this.userData) {
      console.error('Dados do usuário não encontrados');
      return;
    }

    if (!this.urlPagamento) {
      console.error('URL de pagamento não encontrada');
      return;
    }

    console.log('Confirmando pagamento de contribuição direta...');
    
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

    console.log('Salvando reserva no banco:', request);

    this.productsService.postVinculaProdutoUsuario(request).subscribe({
      next: (response) => {
        console.log('Reserva salva com sucesso:', response);
        this.isLoadingPayment = false;
        // Limpar dados após pagamento bem-sucedido
        this.storageService.clearAfterPayment();
        // Após salvar a reserva, redirecionar para pagamento
        //this.goToPayment(this.urlPagamento);
      },
      error: (error) => {
        console.error('Erro ao salvar reserva:', error);
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

  vincularUsuarioReservarProduto() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      return;
    }

    // Validar disponibilidade antes de finalizar reserva
    this.validarDisponibilidadeProduto().then(isAvailable => {
      if (!isAvailable) {
        this.cardErro = true;
        console.error('Produto não está mais disponível para reserva');
        return;
      }
      
      // Produto disponível, prosseguir com a reserva
      this.processarReservaProduto();
    }).catch(error => {
      console.error('Erro ao validar disponibilidade:', error);
      this.cardErro = true;
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

    console.log('Enviando requisição de reserva:', request);

    this.productsService.postVinculaProdutoUsuario(request).subscribe({
      next: (response) => {
        console.log('Reserva realizada com sucesso:', response);
        // Marcar reserva como concluída antes de navegar
        this.storageService.setReservationCompleted(true);
        // Limpar dados após reserva bem-sucedida
        this.storageService.clearAfterReservation();
        this.router.navigate(['/conclusao']);
      },
      error: (error) => {
        console.error('Erro ao realizar reserva:', error);
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
    console.log('Voltando para checkout');
    this.router.navigate(['/checkout']);
  }

  goToHome() {
    console.log('Voltando para home');
    this.router.navigate(['/']);
  }
}