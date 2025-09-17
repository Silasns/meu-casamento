import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ModalSelecaoPagamentoComponent } from '../modal-selecao-pagamento/modal-selecao-pagamento.component';
import { Product } from '../../models/products-response.model';
import { ProductStorageService } from '../../services/product-storage.service';

@Component({
  selector: 'app-card-presente',
  templateUrl: './card-presente.component.html',
  styleUrl: './card-presente.component.scss',
  host: {
    '[class.disabled]': '!product.disponivel'
  }
})
export class CardPresenteComponent implements OnInit {
  @Input() product!: Product;
  
  get hasExternalLink(): boolean {
    return !!(this.product && this.product.linkLojas && this.product.linkLojas.length > 0 && this.product.linkLojas[0].linkProduto);
  }

  get externalUrl(): string {
    if (!this.hasExternalLink) return '';
    return this.product.linkLojas[0].linkProduto;
  }

  constructor(
    private modalService: NbDialogService,
    private router: Router,
    private storageService: ProductStorageService
  ){}

  ngOnInit(): void {
    if (this.product.statusReservado) {
      console.log("statusReservado: ", this.product.statusReservado)
    }
  }

  openModal(){
    this.modalService.open(ModalSelecaoPagamentoComponent,{
      hasScroll: false,
      dialogClass: 'modal-size',
      context: {
        product: this.product
      }
    }
    ).onClose.subscribe(data => {
      if(data){
        console.log('Método selecionado:', data.method);
        console.log('Produto:', data.product);
        
        if (data.method === 'link_loja') {
          // Salvar produto no storage antes de navegar
          console.log('Salvando produto no storage:', data.product);
          this.storageService.setProduct(data.product);
          this.storageService.setPaymentMethod('link_loja');
          console.log('Produto salvo, navegando para checkout');
          // Navegar para checkout quando selecionar "Pegar link da loja"
          this.router.navigate(['/checkout']);
        } else if (data.method === 'pagar_noivos') {
          // Salvar produto e método de pagamento
          console.log('Salvando produto e método de pagamento direto aos noivos');
          this.storageService.setProduct(data.product);
          this.storageService.setPaymentMethod('pagar_noivos');
          this.router.navigate(['/checkout']);
        }
      }
    });
  }

  openExternal(){
    if(!this.hasExternalLink) return;
    const url = this.product.linkLojas[0].linkProduto;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

}
