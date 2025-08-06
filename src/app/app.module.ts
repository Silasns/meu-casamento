import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmacaoComponent } from './pages/confirmacao/confirmacao.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ConclusaoComponent } from './pages/conclusao/conclusao.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardPresenteComponent,
    ModalPresenteComponent,
    ConfirmacaoComponent,
    ConclusaoComponent,
    
  ],
  imports: [
    BrowserModule,
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
    ReactiveFormsModule,
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
