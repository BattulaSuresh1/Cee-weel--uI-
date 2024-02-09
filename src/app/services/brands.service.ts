import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface brand {

  id: number;
  name: string;
  // email: string;
  // password: string;

}


@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  public REST_API_SERVER: string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http: HttpClient) { }



  public getbrandList(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/brandlist?${params.toString()}`,{ params: ""});
  }

  public create(): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/brand-create`);
  }

  public showBrandDetails(id:number|string):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/brand-show/${id}`,{});
  }
  public storeBrand(params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/brand-store`, params);
  }

  public updateBrand(id: any, params): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/brand-update/${id}`, params);
  }
  public deleteBrand(params: any): Observable<any> {
    return this.http.post(`${this.REST_API_SERVER}/brand-delete`,params);
  }
}
