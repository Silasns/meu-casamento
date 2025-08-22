import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/products-response.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProductStorageService {

  private productSubject = new BehaviorSubject<Product | null>(null);
  private userInfo = new BehaviorSubject<UserModel | null>(null);

  readonly product$: Observable<Product | null> = this.productSubject.asObservable();
  readonly userInfo$: Observable<UserModel | null> = this.userInfo.asObservable();

  setUser(user: UserModel): void{
    this.userInfo.next(user);
  }

  setProduct(product: Product): void {
    this.productSubject.next(product);
  }

  clear(): void {
    this.productSubject.next(null);
    this.userInfo.next(null);
  }
}
