import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { ProcuctResposeModel } from '../models/products-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = environment.API_CASAMENTO;
  private urlPagamento = environment.API_INFINITE

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<ProcuctResposeModel>{
    return this.http.get<ProcuctResposeModel>(`${this.baseUrl}/products`);
  }

  getLinkPagamento(request: any) {
    return this.http.post(this.urlPagamento, request)
  }
}
