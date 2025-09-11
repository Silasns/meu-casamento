import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { Product } from '../../models/products-response.model';
import { ProductStorageService } from '../../services/product-storage.service';

@Component({
  selector: 'app-modal-presente',
  templateUrl: './modal-presente.component.html',
  styleUrl: './modal-presente.component.scss'
})
export class ModalPresenteComponent {
  @Input() product!: Product;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected dialogRef: NbDialogRef<ModalPresenteComponent>,
    private router: Router,
    private paymentFlow: PaymentFlowService,
    private storagePayment: ProductStorageService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      telefone: ['', []],
      email: ['', [Validators.required, Validators.email]],
      mensagem: ['', []],
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close();
      this.paymentFlow.start();
      this.storagePayment.setUser(this.form.value);
      this.storagePayment.setProduct(this.product);
      this.router.navigate(['/confirmacao'])
    }
  }
}
