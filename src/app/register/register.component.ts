import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm,FormGroup } from '@angular/forms';
import { RegisterService } from 'app/register/register.service';
import { SocialLoginComponent } from 'app/social-login/social-login.component';
import { User } from "app/shared/user";
declare var $:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ RegisterService]
})
export class RegisterComponent implements OnInit {
  errorClass    = 'error-hide';
  successClass  = 'success-hide';
  errorMsg      = 'Something went wrong';
  successMsg    = '';
  @ViewChild('f') form;
  emailModel = 'a';
  passwordModel='a';
  @Input() // <------
  private socialLoginComponent:SocialLoginComponent;
  constructor(private router:Router,private registerService : RegisterService,private user:User) { }
  ngOnInit() {
     setTimeout(function(thishere){
         thishere.emailModel = '';
         thishere.passwordModel = '';
     },3000,this);
     this.user.updateErrorEvent.subscribe(
       (msg) => this.displayError(msg)
    );
  }

  onSubmit(event,registerInfo:NgForm){
    event.preventDefault();
    this.errorClass   = 'error-hide';
    this.successClass = 'error-hide';
    var re            = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(registerInfo.valid){
      //console.log(registerInfo.value)
      var registerData = registerInfo.value;
      if(!re.test(registerData.email)){
        this.errorClass = 'error-show';
        this.errorMsg   = 'Enter a valid email Id';
      }else if(registerData.password == registerData.cpassword){
          this.registerService.registerUser(registerInfo).subscribe(
              (response) => this.processRegisteredData(response,registerInfo),
              (error) => this.procesErrorData(error)
            )
            
      }else{
        this.errorClass = 'error-show';
        this.errorMsg   = 'Password field and Confirm Password field must be same';
      }  
        
    }
  }

   processRegisteredData(response,registerInfo){
    response = JSON.parse(response['_body']); 
    //console.log(response);
    if(response.success == '1'){ 
       this.successClass = 'success-show';
       this.successMsg   = response.message;
       registerInfo.resetForm();
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
      this.errorMsg   = "An account with this email id is disabled by admin. Please contact admin to activate your account";
    }else{
      this.errorClass   = 'error-hide';
      this.errorMsg     = "";
      this.successClass = "success-hide"
      this.successMsg   = "";
  
    }
    
  }

  signIn(provider){ 
    this.socialLoginComponent.signIn(provider);
  }

  logout(){
    this.socialLoginComponent.logout();
  }

  resetRegForm(){ 
    this.form.resetForm();
  }

 
  
}
