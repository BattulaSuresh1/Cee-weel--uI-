import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  updateOrderStatus(orderId: number, statusId: number) {
    throw new Error('Method not implemented.');
  }
  public REST_API_SERVER: string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http: HttpClient,
    private router: Router) { }

  public getProducts(params: any ): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/productslist?${params.toString()}`,  params );
  }

  public storeProduct(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/product-store`, params);
  }

  public createProduct(): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/product-create`);
  }

  public showProduct(id: number ): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/product-show/${id}`, id);
  }

  public updateProduct(id: number, params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/product-update/${id}`, params);
  }

  public deleteProduct(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/product/delete`, params);
  }

  public productAddToCart(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/cart-store`, params)
  }

  public getCarts(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/cartslist?${params.toString()}`, { params: "" });
  }

  public updateCart(id: number, params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/cart-update/${id}`, params);
  }

  public addLensToCart(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/lenscart-store`, params);
  }

  public addMeasurementsToCart(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/lensmeasurementscart-store`, params);
  }

  public showCart(id: number): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/cart-show/${id}`, id);
  }

  public getOrders(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/orderslist?${params.toString()}`, { params: "" });
  }
  public storeOrder(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/order-store`, params);
  }
  public showOrder(id: number): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/order-show/${id}`, id);
  }
  public updateOrder(id: number, params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/order-update/${id}`, params);
  }

  // public getCustomerOrder(customerId) {
  //   return this.http.get(`${this.REST_API_SERVER}/customer-order/${customerId}`,customerId);
  // }

  public getCustomerOrder(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/CustomerOrdersList?${params.toString()}`, { params: "" });
  }

  public generateSalesInvoice(orderId:number):Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/generate-salesinvoice-pdf/${orderId}`);
  }

  public generateSalesOrder(orderId:number):Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/generate-salesorders-pdf/${orderId}`);
  }



  // public showBrand(params: any = ""): Observable<any> {
  //   return this.http.post(`${this.REST_API_SERVER}/brandlist?${params.toString()}`, { params: "" });
  // }

  // public createBrand(): Observable<any> {
  //   return this.http.get(`${this.REST_API_SERVER}/brandlist`);
  // }

  // public showBrand(id:number|string):Observable<any>{
  //   return this.http.get(`${this.REST_API_SERVER}/brand-show/${id}`);
  // }
  // public storeBrand(params): Observable<any> {
  //   return this.http.post(`${this.REST_API_SERVER}/brand-store`, params);
  // }
  // public getBrandList(params): Observable<any> {
  //   return this.http.post(`${this.REST_API_SERVER}/brandlist?${params.toString()}`,{ params: ""});
  // }

  // public updateBrand(id: number, params): Observable<any> {
  //   return this.http.post(`${this.REST_API_SERVER}/brand-update/${id}`, params);
  // }

  // public deleteBrand(id): Observable<any> {
  //   return this.http.delete(`${this.REST_API_SERVER}/brand-delete`, id);
  // }

  public cancelOrder(orderId: any): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/cancel/${orderId}`,orderId);
  } 
}
