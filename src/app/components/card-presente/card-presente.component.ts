import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ModalPresenteComponent } from '../modal-presente/modal-presente.component';
import { Product } from '../../models/products-response.model';

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

  constructor(
    private modalService: NbDialogService
  ){}

  ngOnInit(): void {
    if (this.product.statusRevervado) {
      console.log("statusReservado: ", this.product.statusRevervado)
    }
  }

  openModal(){
    this.modalService.open(ModalPresenteComponent,{
      hasScroll: false,
      dialogClass: 'modal-size',
      context: {
        product: this.product
      }
    }
    ).onClose.subscribe(data => {
      if(data){
        console.log('Formulário enviado: ', data)
        console.log('Titulo: ', this.product)
      }

    });
  }

}
