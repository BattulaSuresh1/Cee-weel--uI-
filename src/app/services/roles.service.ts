import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../shared/models/Role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http:HttpClient,
      private router:Router) { }

  public getRoles(filterParams:any = ""):Observable<Role[]>{
    return this.http.post<Role[]>(`${this.REST_API_SERVER}/roleslist?${filterParams.toString()}`,{ params: ""});
  }

  // public getRoles(params: any = ""): Observable<any> {
  //   return this.http.post(`${this.REST_API_SERVER}/roleslist?${params.toString()}`, { params: "" });
  // }

  public createRole():Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/role-create`);
  }

  public storeRole(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/role-store`,params);
  }

  public showRole(id:number|string):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/role-show/${id}`,id);
  }

  public updateRole(id:number,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/role-update/${id}`,params);
  }

  public deleteRole(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/role/delete`,params);
  }

  public getPermissionsByRoleId(roleId:number|string = 0):Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/permissions/${roleId}`);
  }

}
