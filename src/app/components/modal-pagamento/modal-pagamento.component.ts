import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Product } from '../../models/products-response.model';
import { UserModel } from '../../models/user.model';
import { ProductsService } from '../../services/products.service';
import { VincularUsuarioRequestModel } from '../../models/vincular-usuario-request.model';
import { ProductStorageService } from '../../services/product-storage.service';

@Component({
  selector: 'app-modal-pagamento',
  templateUrl: './modal-pagamento.component.html',
  styleUrl: './modal-pagamento.component.scss'
})
export class ModalPagamentoComponent {
  @Input() urlPagamento: string = '';
  @Input() product: Product | null = null;
  @Input() userData: UserModel | null = null;
  
  isLoading = false;
  cardErro = false;

  constructor(
    protected dialogRef: NbDialogRef<ModalPagamentoComponent>,
    private productsService: ProductsService,
    private storageService: ProductStorageService
  ) {}

  confirmar() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      return;
    }

    this.isLoading = true;
    this.cardErro = false;

    // Salvar a reserva no banco antes de redirecionar
    this.vincularUsuarioReservarProduto();
  }

  vincularUsuarioReservarProduto() {
    if (!this.product || !this.userData) {
      console.error('Produto ou dados do usuário não encontrados');
      this.isLoading = false;
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
        this.isLoading = false;
        // Limpar dados após pagamento bem-sucedido
        this.storageService.clearAfterPayment();
        // Após salvar a reserva, fechar o modal e redirecionar
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.cardErro = true;
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}