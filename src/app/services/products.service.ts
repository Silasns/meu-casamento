import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { ProcuctResposeModel } from '../models/products-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = environment.API_CASAMENTO;

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<ProcuctResposeModel>{
    return this.http.get<ProcuctResposeModel>(`${this.baseUrl}/products`);
  }
}
