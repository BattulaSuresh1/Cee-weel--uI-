import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, Subject, BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  public totalCartItems$ = new Subject();

  public _customerSubject = new BehaviorSubject<string|number>(0);

  public customerSubject$ = this._customerSubject.asObservable();

  constructor(private http:HttpClient,
      private router:Router) { }

  public login(data:any):Observable<User[]>{
    return this.http.post<User[]>(`${this.REST_API_SERVER}/login`,data);
  }

  public forgotPassword(data:any):Observable<any>{
    return this.http.post<any>(`${this.REST_API_SERVER}/forgotpassword`,data);
  }

  public checkResetPasswordLinkValidOrNot(data:any):Observable<any>{
    return this.http.post<any>(`${this.REST_API_SERVER}/checkresetpasswordlinkvalid`,data);
  }

  public resetPassword(data:any):Observable<any>{
    return this.http.post<any>(`${this.REST_API_SERVER}/resetpassword`,data);
  }

  public setToken(data:any):void{
    localStorage.setItem('access_token', data.access_token);
    // this.setRole(data);
    // this.setOrgId(data);
    this.setUserDetails(data.user);
    this.setPermissions(data.permissions);
    // this.setUserName(data.name);
  }

  public getToken():string {
    return localStorage.getItem('access_token');
  }

  public isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  public logout():void {
    let removeToken = localStorage.removeItem('access_token');
    let user_details = localStorage.removeItem('user_details');
    let permissions = localStorage.removeItem('permissions');
    this.removeCustomerId();
    // let role = localStorage.removeItem('role');
    // let org_id = localStorage.removeItem('org_id');
    // this.removeUserName();
    // this.removeEventType();
    // this.removeWorkingOn();
    // if (removeToken == null && role ==null && org_id == null && user_details == null) {
       this.router.navigate(['/login']);
    // }
  }

  public setPermissions(permissions){
    localStorage.setItem('permissions',JSON.stringify(permissions));
  }

  public getPermissions(){
   return JSON.parse(localStorage.getItem('permissions'));
  }

  public hasPermissions(){

    let roles = JSON.parse(localStorage.getItem('permissions'));

    if (roles && Object.keys(roles).length){
      return Object.keys(roles)[0];
    }
    
    return '0';
  }



  public setRole(data){
    localStorage.setItem('role',JSON.stringify(data.roles));
  }

  public getRole(){
    return localStorage.getItem('role');
  }

  public hasRole(){

    let roles = JSON.parse(localStorage.getItem('role'));

    if (roles && Object.keys(roles).length){
      return Object.keys(roles)[0];
    }
    
    return '0';
  }

  public setOrgId(data){
    localStorage.setItem('org_id',data.org_id);
  }

  public getOrgId(){
    return localStorage.getItem('org_id');
  }

  public setUserDetails(data){

    var user_details = {
      user_id : data.id,
      name: data.name,
      email: data.email,
      role_id: data.role_id
    };

    localStorage.setItem('user_details',JSON.stringify(user_details));

  }

  public getUserDetails(){
    let user_details = JSON.parse(localStorage.getItem('user_details'));
    return user_details;
  }

  public setUserName(UserName:string):void{
    localStorage.setItem('user_name',UserName);
  }

  public getUserName():string{
    return localStorage.getItem('user_name');
  }

  public removeUserName():void{
    localStorage.removeItem('user_name');
  }

  public setEventType(eventType:string):void{
    localStorage.setItem('event_type',eventType);
  }

  public getEventType():string{
    return localStorage.getItem('event_type');
  }

  public removeEventType():void{
    localStorage.removeItem('event_type');
  }

  public setWorkingOn(test:string){
    localStorage.setItem('working_on',test);
  }

  public getWorkingOn(){
    return localStorage.getItem('working_on');
  }

  public removeWorkingOn(){
    localStorage.removeItem('working_on');
  }

  public setCustomerSubject(id:string|number):void{
    console.log(`on cutomer subject`);
    let customerId = (id != null) ? id.toString() : "";
    this._customerSubject.next(customerId);
    // localStorage.setItem('customerId',customerId);
  }

  public getCustomerSubject(){
    return this.customerSubject$;
    // return localStorage.getItem('customerId');
  }

  public getTotalCartItems(){
    return this.totalCartItems$;
  }

  
  public setTotalCartItems(count){
    this.totalCartItems$.next(count);
  }

  public removeCutomerSubject(){
    this._customerSubject.unsubscribe();
  }

  public setCustomerId(id:string|number):void{
    let customerId = (id != null) ? id.toString() : "";
    console.log(`setcutomerid on localstorge.`)
    localStorage.setItem('customerId',customerId);
    this.setCustomerSubject(customerId);
  }

  public getCustomerId():string{
    return localStorage.getItem('customerId');
  }

  public removeCustomerId():void{
    localStorage.removeItem('customerId');
  }

  public getRoleId():string{
    let userDetails = this.getUserDetails();
    return ( userDetails != null) ? userDetails.role_id : '';
  }

  public getMenuPermissions(){
    return {
      'ROLE_MENUS': ['ROLE_CREATE','ROLE_UPDATE','ROLE_DELETE','ROLE_VIEW','ROLE_LIST'], 
      'USER_MENUS': ['USER_CREATE','USER_UPDATE','USER_DELETE','USER_VIEW','USER_LIST'], 
      'CUSTOMER_MENUS': ['CUSTOMER_CREATE','CUSTOMER_UPDATE','CUSTOMER_DELETE','CUSTOMER_VIEW','CUSTOMER_LIST'], 
      'PRODUCT_MENUS': ['PRODUCT_CREATE','PRODUCT_UPDATE','PRODUCT_DELETE','PRODUCT_VIEW','PRODUCT_LIST'], 
      'SUPPLIER_MENUS': ['SUPPLIER_CREATE','SUPPLIER_UPDATE','SUPPLIER_DELETE','SUPPLIER_VIEW','SUPPLIER_LIST'], 
      'WAREHOUSE_MENUS': ['WAREHOUSE_CREATE','WAREHOUSE_UPDATE','WAREHOUSE_DELETE','WAREHOUSE_VIEW','WAREHOUSE_LIST'],  
    }
  }

 
}
