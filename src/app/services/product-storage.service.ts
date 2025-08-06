import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/products-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductStorageService {

  private productSubject = new BehaviorSubject<Product | null>(null);

  readonly product$: Observable<Product | null> = this.productSubject.asObservable();

  setProduct(product: Product): void {
    this.productSubject.next(product);
  }

  clear(): void {
    this.productSubject.next(null);
  }
}
