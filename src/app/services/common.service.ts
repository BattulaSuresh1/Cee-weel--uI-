import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor( private _snackBar: MatSnackBar,
    private http:HttpClient) { }

  openAlert(message:string) {
    let config;
    this._snackBar.open(message,config,{ duration: 3000});
  }

  public getDashboardDetails():Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/dashboard`);
  }
}
