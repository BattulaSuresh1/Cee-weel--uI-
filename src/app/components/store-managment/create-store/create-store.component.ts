import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../../../services/roles.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CURRENT_PAGE, GET_ALL } from '../../../shared/constants/pagination.contacts';
import { Role } from '../../../shared/models/Role';
import { CommonService } from '../../../services/common.service';
import { StoresService } from '../../../services/stores.service';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
export class CreateStoreComponent implements OnInit {

 /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
 @ViewChild('myForm', {static: false}) myForm: NgForm;
 public storeForm:FormGroup;

 public storeId:number = undefined;

 public btnText:string = "Create";


 public roles:Role[];
 public products:any[] = [];
 public store:any;
 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;


  constructor(private dialog: MatDialog,
    private commonService: CommonService,
    private fb:FormBuilder,
    private rolesService:RolesService,
    private storesService: StoresService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      this.storeId = data.id;
    }

  ngOnInit(): void {
    this.createstoreForm();
    this.getstoreDetails();
  }

  getstoreDetails():void{
    // this.storesService.createStore().subscribe(
    //   (res:any) => {
    //       this.products = res.data.products;
    //   }
    // );

    if(this.storeId != undefined){
      this.btnText = "Update";
      this.storesService.showStore(this.storeId).subscribe(
        (res:any) => {
            this.store = res.data.store;
            this.storeForm.patchValue({
              name: this.store.name,
              address: this.store.address,
            });
        }
      );
    }
  }
  
  createstoreForm(){
    this.storeForm = this.fb.group({
      name: ['',[Validators.required]],
      address: ['', [Validators.required]],
    })
  }

  get formValidate(){
    return this.storeForm.controls;
  }

  storeFormSubmit(){

    if(this.storeForm.invalid){
      return;
    }

    if(this.storeId == undefined){
      this.storesService.storeStore(this.storeForm.value).subscribe(
        (response)=>{
        
           if (response.success == true) {
              this.storeForm.reset();
              this.myForm.resetForm();
              this.createstoreForm();
            } 

            this.commonService.openAlert(response.message); 
        },
        (err)=>{ 
  
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.storeForm.get(prop);
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
     
      this.storesService.updateStore(this.storeId,this.storeForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.storeForm.get(prop);
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
