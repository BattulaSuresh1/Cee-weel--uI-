import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http:HttpClient,
      private router:Router) { }

  public getUsers(params:any = ""):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/userslist?${params.toString()}`,{ params: ""});
  }

  public storeUser(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/user-store`,params);
  }

  public showUser(id:number|string):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/user-show/${id}`,id);
  }

  public updateUser(id:number,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/user-update/${id}`,params);
  }

  public deleteUser(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/user/delete`,params);
  }
}
