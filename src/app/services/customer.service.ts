import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  public REST_API_SERVER: string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http: HttpClient,
    private router: Router) { }

  public getCustomers(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/customerslist?${params.toString()}`, { params: "" });
  }

  public storeCustomer(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/customer-store`, params);
  }

  public createCustomer(): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/customer-create`);
  }

  public showCustomer(id: number | string): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/customer-show/${id}`, id);
  }

  public updateCustomer(id: number, params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/customer-update/${id}`, params);
  }

  public deleteCustomer(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/customer/delete`, params);
  }

  public getVisits(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/customer-visits?${params.toString()}`, { params: "" });
  }

  public showVisit(id: number | string): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/visit-show/${id}`, id);
  }

  public getCustomerOverview(params: any): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/customer-overview`, params);
  }
  public getStatesCountry(countryId: number): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/states/${countryId}`);
  }
  public getStatesCities(stateId: number): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/cities/${stateId}`);
  }

}
