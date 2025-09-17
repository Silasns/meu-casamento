import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbDialogModule,
  NbInputModule,
  NbRadioModule,
  NbAlertModule,
  NbAccordionModule,
  NbIconLibraries,
  
} from '@nebular/theme';

import { NbEvaIconsModule } from '@nebular/eva-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CardPresenteComponent } from './components/card-presente/card-presente.component';
import { ModalPresenteComponent } from './components/modal-presente/modal-presente.component';
import { ConfirmacaoComponent } from './pages/confirmacao/confirmacao.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ConclusaoComponent } from './pages/conclusao/conclusao.component';
import { ConclusaoPayComponent } from './pages/conclusao-pay/conclusao-pay.component';
import { ModalSelecaoPagamentoComponent } from './components/modal-selecao-pagamento/modal-selecao-pagamento.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { FinalizarComponent } from './pages/finalizar/finalizar.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { ModalPagamentoComponent } from './components/modal-pagamento/modal-pagamento.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardPresenteComponent,
    ModalPresenteComponent,
    ConfirmacaoComponent,
    ConclusaoComponent,
    ConclusaoPayComponent,
    ModalSelecaoPagamentoComponent,
    CheckoutComponent,
    FinalizarComponent,
    StepIndicatorComponent,
    ModalPagamentoComponent,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule.forRoot(), 
    NbCardModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbCardModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbIconModule,
    NbDialogModule.forRoot(),
    NbInputModule,
    NbRadioModule,
    NbAlertModule,
    NbAccordionModule
  ],
  providers: [
     provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
