import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'app/login/login.service';
import { SocialLoginComponent } from 'app/social-login/social-login.component';
import { User } from "app/shared/user";
import { StorageService } from "app/shared/storage.service";
declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ LoginService]
})
export class LoginComponent implements OnInit {
  @ViewChild('f') form;
  errorClass    = 'error-hide';
  errorMsg      = 'Something went wrong';
  successClass  = 'success-hide';
  @Input() // <------
  private socialLoginComponent:SocialLoginComponent;
  public rememberMe = null;
  returnUrl: string;
  constructor(private route: ActivatedRoute,private router:Router,private loginService : LoginService,private user:User) { }

  ngOnInit() {
     this.user.updateErrorEvent.subscribe(
       (msg) => this.displayError(msg)
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'meetings-list';
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

          // To authenticate user login
          this.loginService.validateLogin(loginInfo).subscribe(
              (response) => this.processLoginData(response),
              (error) => this.procesErrorData(error)
            );
      }
      
    }
      
  }
  
  resetForm(){
     this.form.resetForm();
  }

  openForgotModal(){
    $('#forgetPassword').modal('show');
    this.successClass  = 'success-hide';
  }

  processLoginData(response){
    response = JSON.parse(response['_body']); 
    if(response.success == '1'){ 
        response.body.token = response.token;
        if(this.rememberMe != null){
          localStorage.setItem('remember', 'true'); 
        }else{
          localStorage.setItem('remember', 'false'); 
        }
        this.user.putUser(response.body);
        if(response.body.us_role_id == 2){
          this.router.navigateByUrl('facilitator/events-calendar');
        }else{
          if(response.body.is_first_login == 1){
             this.router.navigateByUrl('user-profile#subscription')
          }else{
             this.router.navigateByUrl(this.returnUrl);
             //this.router.navigateByUrl('meetings-list');
          }
        }
        
    }else{
      
    }
  }

  procesErrorData(response){
    response = JSON.parse(response['_body']);
    this.errorClass = 'error-show';
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
  }

  displayError(msg){
    if(msg != 'clear'){
      this.errorClass = 'error-show';
      this.errorMsg   = msg.replace(/<\/?[^>]+(>|$)/g, "");
    }else{
      this.errorClass = 'error-hide';
      this.errorMsg   = "";
  
    }
    
  }
    

  signIn(provider){ console.log(provider)
    this.socialLoginComponent.signIn(provider);
  }

  logout(){
    this.socialLoginComponent.logout();
  }
  
}
