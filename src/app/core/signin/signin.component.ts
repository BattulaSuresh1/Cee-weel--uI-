import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';

// import { AuthenticationService } from 'src/app/auth/services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public loginForm:FormGroup;
  public loginFormSubmit:boolean= false;
  public is_error_msg:boolean= false;
  public hide:any;


  constructor( private fb:FormBuilder,
    private authenticationService:AuthenticationService,
    private route:Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  /* Create Login Form*/
  createForm(){
    this.loginForm = this.fb.group({
      email:['' ,[Validators.required,Validators.email]],
      password: ['',[Validators.required]]
    });
  }

  /* Login Form Validator */
  get loginFormValidate(){ return this.loginForm.controls}
  
  /* Login Form Submit */
  loginSubmit(){
    this.loginFormSubmit = true;
    this.is_error_msg= false;
    if(this.loginForm.invalid){
      return;
    }

    this.loginFormSubmit = false;
    this.authenticationService.login(this.loginForm.value).subscribe(
      (res:any)=>{
        if(res.code == 200){
          this.authenticationService.setToken(res);
          this.route.navigate(['dashboard']);
        }else if(res.code == 401){
          this.is_error_msg= true;
        }
      },
      (err)=>{
        console.log( `Error Message :: `,err);
      }
    );
  }
}
