import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, NgForm, FormArray } from '@angular/forms';
import { RolesService } from '../../../services/roles.service';
import { HttpErrorResponse } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css']
})
export class RoleCreateComponent implements OnInit {
  /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
  @ViewChild('myForm', {static: false}) myForm: NgForm;

 public roleForm:FormGroup;
 public roleId:number = undefined;
 public activePermissions:any = [];
 public roleHasPermission:boolean = true;
 public btnText:string = "Create";

  constructor(private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb:FormBuilder,
    private rolesService:RolesService,
    private commonService:CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      this.roleId = data.id;
    }

  ngOnInit(): void {
    this.createRoleForm();
    this.getRoleDetails();
  }

  getRoleDetails():void{
    if(this.roleId != undefined){
      this.btnText = "Update";
      this.rolesService.showRole(this.roleId).subscribe(
        (res) => {
          console.log(res);
          let permissionList = res.data.permissions;
          this.activePermissions = res.data.activePermissions;
          let role = res.data.role;
          this.loadRolesFormsData(permissionList);
          this.roleForm.patchValue({
            name: role.name
          });
        },
        (err) => {
          console.log(err);
        }
      )
    }else{
      this.getPermissions();
    }
  }

  getPermissions():void{
    this.rolesService.createRole().subscribe(
      (res:any)=>{
         let permissionList = res.permissions;
         this.loadRolesFormsData(permissionList);         
      }
    )
  }

  createRoleForm(){
    this.roleForm = this.fb.group({
      name: ['',[Validators.required]],
      permissionGroups: this.fb.array([])
    })
  }

  get formValidate(){
    return this.roleForm.controls;
  }

  permissionGroups(): FormArray {
    return this.roleForm.get('permissionGroups') as FormArray;
  }

  newPermissionGroup(): FormGroup{
     return this.fb.group({
        group_name: [''],
        permissions:  this.fb.array([])
    });
  }

  addPermissionGroup(){
     this.permissionGroups().push(this.newPermissionGroup());
  }

  permissions(groupIndex:number): FormArray  {
    return this.permissionGroups().at(groupIndex).get("permissions") as FormArray;
  }

  newPermission(): FormGroup{
    return this.fb.group({
      id: [''],
      name: [''],
      permission_group: [''],
      give_permission: [this.roleHasPermission]
  });
  }

  addPermission(groupIndex:number) {
   
    this.permissions(groupIndex).push(this.newPermission());
  }

  roleFormSubmit(){
    if(this.roleForm.invalid){
      return;
    }

   
    if(this.roleId == undefined){
      this.rolesService.storeRole(this.roleForm.value).subscribe(
        (response)=>{
            this.roleForm.reset();
            this.myForm.resetForm();
            this.commonService.openAlert(response.message); 
            this.createRoleForm();
            this.getPermissions();
        },
        (err)=>{ 
  
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.roleForm.get(prop);
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
     
      this.rolesService.updateRole(this.roleId,this.roleForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.roleForm.get(prop);
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

  private loadRolesFormsData(permissionList:any = []):void{

    permissionList.forEach((element,groupIndex) => {
        this.addPermissionGroup();
        element.permissions.forEach((permissions,i) => {
          console.log(permissions.id);
            let permissionsId = permissions.id;
            this.checkRoleHasPermission(permissionsId);
            this.addPermission(groupIndex);
           
        });
    });

    this.roleForm.patchValue({
      name: "",
      permissionGroups: permissionList
    });

  }

  private checkRoleHasPermission(permissionsId:number):void{
      this.roleHasPermission = true;
      if(this.roleId != undefined){
        this.roleHasPermission = false;
        let element = this.activePermissions.find((p) => p.permission_id === permissionsId );
        if(element){
          this.roleHasPermission = true;
        }
      }
  }

  cancel():void{
    this.dialog.closeAll();
  }



}
