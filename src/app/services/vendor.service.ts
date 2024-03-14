import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VendorService {
  public REST_API_SERVER: string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http: HttpClient,
    private router: Router) { }

  public getVendors(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/vendorlist?${params.toString()}`, { params: "" });
  }

  public storeVendors(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/vendor-store`, params);
  }

  public createVendor(): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/vendor-create`);
  }

  public showVendor(id: number | string): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/vendor-show/${id}`, id);
  }

  public updateVendor(id: number, params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/vendor-update/${id}`, params);
  }

  public deleteVendor(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/Vendor/delete`, params);
  }

  public getVisits(params: any = ""): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/vendor-visits?${params.toString()}`, { params: "" });
  }

  public showVisit(id: number | string): Observable<any> {
    return this.http.put(`${this.REST_API_SERVER}/visit-show/${id}`, id);
  }

  public getVendorOverview(params: any): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/vendor-overview`, params);
  }
  public getStatesCountry(countryId: number): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/states/${countryId}`);
  }
  public getStatesCities(stateId: number): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/cities/${stateId}`);
  }

}
