import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/products-response.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProductStorageService {

  // Chaves para sessionStorage
  private readonly PRODUCT_KEY = 'selectedProduct';
  private readonly USER_KEY = 'userData';
  private readonly PAYMENT_METHOD_KEY = 'paymentMethod';
  private readonly RESERVATION_COMPLETED_KEY = 'reservationCompleted';
  private readonly CONTRIBUTION_KEY = 'contributionData';
  private readonly TIMESTAMP_KEY = 'storageTimestamp';
  
  // Tempo máximo para manter dados (30 minutos)
  private readonly MAX_STORAGE_TIME = 30 * 60 * 1000; // 30 minutos em ms

  // BehaviorSubjects para compatibilidade com código existente
  private productSubject = new BehaviorSubject<Product | null>(this.getCurrentProduct());
  private userInfo = new BehaviorSubject<UserModel | null>(this.getCurrentUser());
  private reservationCompleted = new BehaviorSubject<boolean>(this.getReservationCompleted());
  private paymentMethod = new BehaviorSubject<string>(this.getPaymentMethod());

  readonly product$: Observable<Product | null> = this.productSubject.asObservable();
  readonly userInfo$: Observable<UserModel | null> = this.userInfo.asObservable();
  readonly reservationCompleted$: Observable<boolean> = this.reservationCompleted.asObservable();
  readonly paymentMethod$: Observable<string> = this.paymentMethod.asObservable();

  constructor() {
    // Inicializar BehaviorSubjects com dados do sessionStorage
    this.initializeFromStorage();
    
    // Limpar dados antigos se necessário
    this.cleanupOldData();
  }

  private initializeFromStorage(): void {
    // Carregar dados do sessionStorage para os BehaviorSubjects
    const product = this.getCurrentProduct();
    const user = this.getCurrentUser();
    const paymentMethod = this.getPaymentMethod();
    const reservationCompleted = this.getReservationCompleted();

    this.productSubject.next(product);
    this.userInfo.next(user);
    this.paymentMethod.next(paymentMethod);
    this.reservationCompleted.next(reservationCompleted);
  }

  private cleanupOldData(): void {
    try {
      const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);
      if (timestamp) {
        const storageTime = parseInt(timestamp);
        const currentTime = Date.now();
        const timeDiff = currentTime - storageTime;

        // Se os dados são mais antigos que o tempo máximo, limpar
        if (timeDiff > this.MAX_STORAGE_TIME) {
          this.clear();
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar idade dos dados:', error);
      // Em caso de erro, limpar tudo para segurança
      this.clear();
    }
  }

  setUser(user: UserModel): void {
    try {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      sessionStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
      this.userInfo.next(user);
    } catch (error) {
    }
  }

  setProduct(product: Product): void {
    try {
      sessionStorage.setItem(this.PRODUCT_KEY, JSON.stringify(product));
      sessionStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
      this.productSubject.next(product);
    } catch (error) {
    }
  }

  getCurrentProduct(): Product | null {
    try {
      const stored = sessionStorage.getItem(this.PRODUCT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao recuperar produto:', error);
      return null;
    }
  }

  getCurrentUser(): UserModel | null {
    try {
      const stored = sessionStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  }

  setReservationCompleted(completed: boolean): void {
    try {
      sessionStorage.setItem(this.RESERVATION_COMPLETED_KEY, JSON.stringify(completed));
      this.reservationCompleted.next(completed);
    } catch (error) {
    }
  }

  getReservationCompleted(): boolean {
    try {
      const stored = sessionStorage.getItem(this.RESERVATION_COMPLETED_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error('Erro ao recuperar status de reserva:', error);
      return false;
    }
  }

  setPaymentMethod(method: string): void {
    try {
      sessionStorage.setItem(this.PAYMENT_METHOD_KEY, method);
      this.paymentMethod.next(method);
    } catch (error) {
    }
  }

  getPaymentMethod(): string {
    try {
      return sessionStorage.getItem(this.PAYMENT_METHOD_KEY) || '';
    } catch (error) {
      console.error('Erro ao recuperar método de pagamento:', error);
      return '';
    }
  }

  setContributionData(contributionData: { tipo: string, valor: number }): void {
    try {
      sessionStorage.setItem(this.CONTRIBUTION_KEY, JSON.stringify(contributionData));
      sessionStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
    }
  }

  getContributionData(): { tipo: string, valor: number } | null {
    try {
      const stored = sessionStorage.getItem(this.CONTRIBUTION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  clear(): void {
    try {
      // Limpar sessionStorage
      sessionStorage.removeItem(this.PRODUCT_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.PAYMENT_METHOD_KEY);
      sessionStorage.removeItem(this.RESERVATION_COMPLETED_KEY);
      sessionStorage.removeItem(this.CONTRIBUTION_KEY);
      sessionStorage.removeItem(this.TIMESTAMP_KEY);

      // Limpar BehaviorSubjects
      this.productSubject.next(null);
      this.userInfo.next(null);
      this.reservationCompleted.next(false);
      this.paymentMethod.next('');

    } catch (error) {
    }
  }

  // Método para verificar se há dados salvos
  hasData(): boolean {
    return !!(this.getCurrentProduct() || this.getCurrentUser());
  }

  // Método para debug - mostrar todos os dados salvos
  debugStorage(): void {
    console.log('=== DEBUG SESSION STORAGE ===');
    console.log('Produto:', this.getCurrentProduct());
    console.log('Usuário:', this.getCurrentUser());
    console.log('Método de Pagamento:', this.getPaymentMethod());
    console.log('Reserva Concluída:', this.getReservationCompleted());
    console.log('Dados de Contribuição:', this.getContributionData());
    console.log('Timestamp:', sessionStorage.getItem(this.TIMESTAMP_KEY));
    console.log('=============================');
  }

  // Método para limpar dados após conclusão da reserva
  clearAfterReservation(): void {
    this.clear();
  }

  // Método para limpar dados após pagamento
  clearAfterPayment(): void {
    this.clear();
  }

  // Método para verificar se os dados são válidos (não expirados)
  isDataValid(): boolean {
    try {
      const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);
      if (!timestamp) return false;
      
      const storageTime = parseInt(timestamp);
      const currentTime = Date.now();
      const timeDiff = currentTime - storageTime;
      
      return timeDiff <= this.MAX_STORAGE_TIME;
    } catch (error) {
      return false;
    }
  }
}
