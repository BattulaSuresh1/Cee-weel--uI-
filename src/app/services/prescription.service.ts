import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http:HttpClient,
      private router:Router) { }

  public getPrescriptions(params:any = ""):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/prescriptionslist?customerId=${params.toString()}`,{ params: ""});
  }

  public storePrescription(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/prescription-store`,params);
  }

  public createPrescription():Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/prescription-create`);
  }

  public showPrescription(id:number):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/prescription-show/${id}`,id);
  }

  public updatePrescription(id:any ,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/prescription-update/${id}`,params);
  }

  public deletePrescription(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/prescription/delete`,params);
  } 

  

  // //--lens Details

  // public storeLensDetails(params):Observable<any>{
  //   return this.http.post(`${this.REST_API_SERVER}/prescription-store`,params);
  // }

  // public createLensDetails():Observable<any>{
  //   return this.http.get(`${this.REST_API_SERVER}/prescription-create`);
  // }
  
}
