import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ModalPresenteComponent } from '../modal-presente/modal-presente.component';
import { Product } from '../../models/products-response.model';

@Component({
  selector: 'app-card-presente',
  templateUrl: './card-presente.component.html',
  styleUrl: './card-presente.component.scss'
})
export class CardPresenteComponent {
  @Input() product!: Product;

  constructor(
    private modalService: NbDialogService
  ){}

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
