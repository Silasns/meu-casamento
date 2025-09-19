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
    return this.http.get<ProcuctResposeModel>(`${this.baseUrl}/produtos`);
  }

  getLinkPagamento(request: ProductLinkRequest) {
    return this.http.post<ProductLinkResponse>(`${this.baseUrl}/link-pagamento`, request)
  }

  patchProduto(id: string, request: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/produtos/${id}/status`, request)
  }

  postVinculaProdutoUsuario(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/reservar`, request);
  }

  getDisponibilidadeProduto(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/produtos/${id}`);
  }
}
