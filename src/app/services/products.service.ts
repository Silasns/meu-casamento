import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { ProcuctResposeModel } from '../models/products-response.model';
import { environment } from '../../environments/environment';
import { ProductLinkRequest } from '../models/product-link-request.model';
import { ProductLinkResponse } from '../models/product-link-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = environment.API_CASAMENTO;

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<ProcuctResposeModel>{
    return this.http.get<ProcuctResposeModel>(`${this.baseUrl}/api/produtos`);
  }

  getLinkPagamento(request: ProductLinkRequest) {
    return this.http.post<ProductLinkResponse>(`${this.baseUrl}/api/link-pagamento`, request)
  }
}
