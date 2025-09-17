import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductStorageService } from '../../services/product-storage.service';
import { Product } from '../../models/products-response.model';
import { UserModel } from '../../models/user.model';
import { ProductsService } from '../../services/products.service';
import { VincularUsuarioRequestModel } from '../../models/vincular-usuario-request.model';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrl: './finalizar.component.scss'
})
export class FinalizarComponent implements OnInit {
  product: Product | null = null;
  userData: UserModel | null = null;
  confirmReservation = false;
  cardErro = false;
  method = 'lojas'; // Método para reserva via lojas (igual ao usado na confirmação)
  
  readonly product$: Observable<Product | null>;
  readonly userInfo$: Observable<UserModel | null>;

  constructor(
    private router: Router,
    private storageService: ProductStorageService,
    private productsService: ProductsService
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
    
    // Carregar produto e dados do usuário
    const currentProduct = this.storageService.getCurrentProduct();
    const currentUser = this.storageService.getCurrentUser();
    
    if (!currentProduct) {
      console.log('Nenhum produto encontrado, redirecionando para home');
      this.router.navigate(['/']);
      return;
    }
    
    this.product = currentProduct;
    this.userData = currentUser;
    
    console.log('Produto carregado:', this.product);
    console.log('Dados do usuário:', this.userData);
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      console.log('Link copiado:', link);
    });
  }

  finalizeReservation() {
    if (this.confirmReservation && this.product && this.userData) {
      console.log('Finalizando reserva...');
      this.vincularUsuarioReservarProduto();
    }
  }

  vincularUsuarioReservarProduto() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      return;
    }

    const request: VincularUsuarioRequestModel = {
      nome: this.userData.nome,
      telefone: this.userData.telefone,
      email: this.userData.email,
      mensagem: this.userData.mensagem,
      produtoId: this.product.id,
      meioReserva: this.method
    };

    console.log('Enviando requisição:', request);

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

  goBack() {
    console.log('Voltando para checkout');
    this.router.navigate(['/checkout']);
  }

  goToHome() {
    console.log('Voltando para home');
    this.router.navigate(['/']);
  }
}