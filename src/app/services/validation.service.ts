import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private productsService: ProductsService) {}

  /**
   * Valida se um produto ainda está disponível para reserva
   * @param productId ID do produto a ser validado
   * @returns Observable<boolean> true se disponível, false se não
   */
  validateProductAvailability(productId: string): Observable<boolean> {
    // TODO: Implementar chamada real para API de validação
    // Por enquanto, simular validação
    return this.productsService.getDisponibilidadeProduto(productId).pipe(
        map((response) => response),
        catchError((error) => of(false))
    );
  }

  /**
   * Valida se os dados de uma sessão são consistentes
   * @param paymentMethod Método de pagamento
   * @param hasProduct Se tem produto associado
   * @param hasContributionData Se tem dados de contribuição
   * @returns boolean true se consistente, false se não
   */
  validateSessionConsistency(paymentMethod: string, hasProduct: boolean, hasContributionData: boolean): boolean {
    switch (paymentMethod) {
      case 'contribuicao_direta':
        return !hasProduct && hasContributionData;
      case 'pagar_noivos':
      case 'link_loja':
        return hasProduct && !hasContributionData;
      default:
        return false;
    }
  }

  /**
   * Gera um ID único para transações
   * @param prefix Prefixo para o ID
   * @returns string ID único
   */
  generateUniqueTransactionId(prefix: string = 'txn'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Valida se uma URL é segura para redirecionamento
   * @param url URL a ser validada
   * @returns boolean true se segura, false se não
   */
  validateSafeUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // Permitir HTTPS e HTTP para desenvolvimento
      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
        return false;
      }
      
      // Validar domínios permitidos (ajustar conforme necessário)
      const allowedDomains = [
        'localhost', 
        '127.0.0.1', 
        'checkout.infinitepay.io', // Domínio do gateway de pagamento
        'infinitepay.io',
        'silas-nc', // Subdomínio específico do projeto
        'seu-dominio.com'
      ];
      
      const hostname = urlObj.hostname;
      
      // Verificar se o hostname contém algum dos domínios permitidos
      const isAllowed = allowedDomains.some(domain => {
        const result = hostname.includes(domain);
        return result;
      });
      
      // Validação específica para InfinitePay (qualquer subdomínio)
      const isInfinitePay = hostname.endsWith('.infinitepay.io') || hostname === 'infinitepay.io';
      
      const finalResult = isAllowed || isInfinitePay;
      return finalResult;
    } catch (error) {
      return false;
    }
  }
}
