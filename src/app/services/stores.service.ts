import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http:HttpClient,
      private router:Router) { }

  public getStores(params:any = ""):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/storeslist?${params.toString()}`,{ params: ""});
  }

  public storeStore(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/store-store`,params);
  }

  public createStore():Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/store-create`);
  }

  public showStore(id:number):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/store-show/${id}`,id);
  }

  public updateStore(id:number,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/store-update/${id}`,params);
  }

  public deleteStore(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/store/delete`,params);
  } 

}
