import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http:HttpClient,
      private router:Router) { }

  public getInventories(params:any = ""):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/inventoryslist?${params.toString()}`,{ params: ""});
  }

  public storeInventory(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/inventory-store`,params);
  }

  public createInventory():Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/inventory-create`);
  }

  public showInventory(id:number):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/inventory-show/${id}`,id);
  }

  public updateInventory(id:number,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/inventory-update/${id}`,params);
  }

  public deleteInventory(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/inventory/delete`,params);
  } 

  
}
