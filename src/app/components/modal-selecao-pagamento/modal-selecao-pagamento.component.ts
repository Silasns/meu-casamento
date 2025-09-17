import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Product } from '../../models/products-response.model';

@Component({
  selector: 'app-modal-selecao-pagamento',
  templateUrl: './modal-selecao-pagamento.component.html',
  styleUrl: './modal-selecao-pagamento.component.scss'
})
export class ModalSelecaoPagamentoComponent {
  @Input() product!: Product;

  constructor(
    protected dialogRef: NbDialogRef<ModalSelecaoPagamentoComponent>
  ) {}

  cancel() {
    this.dialogRef.close(null);
  }

  selectPaymentMethod(method: 'pagar_noivos' | 'link_loja') {
    this.dialogRef.close({
      method: method,
      product: this.product
    });
  }
}