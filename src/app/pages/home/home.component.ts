import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { ProductStorageService } from '../../services/product-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: any = [];
  showWelcomeModal: boolean = true;
  
  // Valores para contribuições
  valorNoivos: string = '';
  
  // Erros de validação
  valorNoivosError: boolean = false;

  constructor(
    private productService: ProductsService,
    private paymentFlow: PaymentFlowService,
    private paymentStorage: ProductStorageService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Ir para o topo imediatamente ao carregar a página
    window.scrollTo(0, 0);
    this.paymentStorage.clear()
    this.paymentFlow.clear();
    this.getProdutcs();
    
    
    // Configurar botão "Voltar ao topo"
    this.setupBackToTopButton();
    
    // Garantir que sempre vá para o topo em qualquer navegação
    this.setupScrollToTopOnNavigation();
  }

  setupScrollToTopOnNavigation() {
    // Ir para o topo quando a página for carregada
    window.addEventListener('load', () => {
      window.scrollTo(0, 0);
    });
    
    // Ir para o topo quando houver mudança de rota
    window.addEventListener('popstate', () => {
      window.scrollTo(0, 0);
    });
  }

  setupBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton?.classList.add('show');
      } else {
        backToTopButton?.classList.remove('show');
      }
    });
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

  // Métodos para inputs de moeda
  onValorNoivosChange(event: any): void {
    const value = event.target.value;
    this.valorNoivos = this.formatCurrency(value);
    this.valorNoivosError = false;
  }


  formatCurrency(value: string): string {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (numbers === '') return '';
    
    // Converte para centavos e formata
    const amount = parseInt(numbers);
    const formatted = (amount / 100).toFixed(2).replace('.', ',');
    
    return formatted;
  }

  // Método para permitir apenas números
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir apenas números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validateValorNoivos(): void {
    const numericValue = this.getNumericValue(this.valorNoivos);
    this.valorNoivosError = numericValue < 5.00;
  }

  getNumericValue(formattedValue: string): number {
    if (!formattedValue) return 0;
    return parseFloat(formattedValue.replace(',', '.'));
  }

  // Métodos para enviar contribuições
  enviarValorNoivos(): void {
    const numericValue = this.getNumericValue(this.valorNoivos);
    if (numericValue >= 5.00) {
      this.router.navigate(['/checkout'], { 
        queryParams: { 
          tipo: 'noivos',
          valor: numericValue * 100 // Convertendo para centavos
        } 
      });
    } else {
      this.valorNoivosError = true;
    }
  }


  scrollToTop() {
    // Scroll suave e gradual para o topo (apenas quando chamado pelo botão)
    const scrollToTop = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 0) {
        window.scrollTo(0, currentScroll - currentScroll / 8);
        requestAnimationFrame(scrollToTop);
      }
    };
    
    // Iniciar o scroll suave
    requestAnimationFrame(scrollToTop);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
