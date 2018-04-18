import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminLoginService } from 'app/admin/admin-login/admin-login.service';
import { SocialLoginComponent } from 'app/social-login/social-login.component';
import { User } from "app/shared/user";
import { StorageService } from "app/shared/storage.service";
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [ AdminLoginService]
})
export class AdminLoginComponent implements OnInit {
  @ViewChild('f') form;
  errorClass = 'error-hide';
  errorMsg   = 'Something went wrong';
  @Input() // <------
  private socialLoginComponent:SocialLoginComponent;
  public rememberMe = null;
  constructor(private router:Router,private adminLoginService : AdminLoginService,private user:User) { }

  ngOnInit() {
     
  }

  onSubmit(event,loginInfo:NgForm){
    
    
    event.preventDefault();
    this.errorClass = 'error-hide';
    var re          = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.rememberMe = loginInfo.value.rememberMe;

    if(loginInfo.value.email && !re.test(loginInfo.value.email)){
        this.errorClass = 'error-show';
        this.errorMsg   = 'Enter a valid email Id';
    }
    if(loginInfo.valid){

      if(!re.test(loginInfo.value.email)){
          this.errorClass = 'error-show';
          this.errorMsg   = 'Enter a valid email Id';
      }else{

          // To authenticate admin login
          loginInfo.value.role_id = "1";
          this.adminLoginService.validateLogin(loginInfo).subscribe(
              (response) => this.processLoginData(response),
              (error) => this.procesErrorData(error)
            );
      }
      
    }
      
  }
  resetForm(){
     this.form.resetForm();
  }
  
  processLoginData(response){
    response = JSON.parse(response['_body']); 
     //console.log(response);
    if(response.success == '1'){ 
        this.router.navigateByUrl('admin/events-calendar');
        response.body.token    = response.token;
        response.body.role     =  "admin";
        console.log(response)
        if(this.rememberMe != null){
          localStorage.setItem('remember', 'true'); 
        }else{
          localStorage.setItem('remember', 'false'); 
        }
        this.user.putUser(response.body);
    }else{
      
    }
  }

  procesErrorData(response){
    response = JSON.parse(response['_body']);
    this.errorClass = 'error-show';
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
  }
    

  // signIn(provider){ 
  //   this.socialLoginComponent.signIn(provider);
  // }

  logout(){
    this.socialLoginComponent.logout();
  }
  
}

