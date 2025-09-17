import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmacaoComponent } from './pages/confirmacao/confirmacao.component';
import { ConclusaoComponent } from './pages/conclusao/conclusao.component';
import { ConclusaoPayComponent } from './pages/conclusao-pay/conclusao-pay.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { FinalizarComponent } from './pages/finalizar/finalizar.component';
import { ConfirmationGuard } from './guards/confirmation.guard';

const routes: Routes = [ 
  { path: '', component: HomeComponent },
  { 
    path: 'confirmacao', 
    component: ConfirmacaoComponent,
    canActivate: [ConfirmationGuard] 
  },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'finalizar', component: FinalizarComponent },
  { path: 'conclusao', component: ConclusaoComponent },
  { path: 'conclusao-pay', component: ConclusaoPayComponent }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
