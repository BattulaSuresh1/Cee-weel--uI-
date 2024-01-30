import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../../../services/roles.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CURRENT_PAGE, GET_ALL } from '../../../shared/constants/pagination.contacts';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Role } from '../../../shared/models/Role';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
  @ViewChild('myForm', {static: false}) myForm: NgForm;
 public userForm:FormGroup;

 public userId:number = undefined;

 public btnText:string = "Create";


 public roles:Role[];
 public user:any;
 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;


  constructor(private dialog: MatDialog,
    private commonService: CommonService,
    private fb:FormBuilder,
    private rolesService:RolesService,
    private usersService:UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      this.userId = data.id;
    }

  ngOnInit(): void {
    this.createUserForm();
    this.getRoles(this.current_page, this.page_length);
    this.getUserDetails();
  }

  getUserDetails():void{
    if(this.userId != undefined){
      this.btnText = "Update";
      // this.userForm.controls["password"].clearValidators();
      // this.userForm.controls["password"].updateValueAndValidity();
      this.usersService.showUser(this.userId).subscribe(
        (res:any) => {
            this.roles = res.data.roles;
            this.user = res.data.user;
            this.userForm.patchValue({
                name: this.user.name,
                email: this.user.email,
                password: this.user.password,
                role_id: +this.user.role_id,
            });
        }
      );
    }
  }
  

  getRoles(currentPage, perPage):void{
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);

    this.rolesService.getRoles(params)
    .subscribe((response: any) =>{
        this.roles = response.data;
    })
  }

  createUserForm(){
    this.userForm = this.fb.group({
      name: ['',[Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      password: ['',[Validators.required]],
      role_id: ['',[Validators.required]]
    })
  }

  get formValidate(){
    return this.userForm.controls;
  }

  userFormSubmit(){

    if(this.userId != undefined){
      this.userForm.patchValue({
        password: this.user.password
      });
    }

    if(this.userForm.invalid){
      return;
    }

    if(this.userId == undefined){
      this.usersService.storeUser(this.userForm.value).subscribe(
        (response)=>{
            this.userForm.reset();
            this.myForm.resetForm();
            this.commonService.openAlert(response.message); 
            this.createUserForm();
        },
        (err)=>{ 
  
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.userForm.get(prop);
                  if(formControl){
                    formControl.setErrors({
                      serverError: validatonErrors[prop]
                    });
                  }
                });
              }
            }
        }
      )

    }else{
     
      this.usersService.updateUser(this.userId,this.userForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.userForm.get(prop);
                  if(formControl){
                    formControl.setErrors({
                      serverError: validatonErrors[prop]
                    });
                  }
                });
              }
            }
        }
      )
    }
  }

  cancel():void{
    this.dialog.closeAll();
  }

 

}
