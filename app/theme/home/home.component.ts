import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RegisterComponent } from 'app/register/register.component';
import { StorageService } from "app/shared/storage.service";
import { LoginComponent } from "app/login/login.component";
import { User } from "app/shared/user";
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public isExpired      = false;
  public isActivated    = false;
  public errorMsg       = "";
  public isResetPassword= "";
  @ViewChild('logincomponent') loginComponent;
  @ViewChild('registerComponent') registerComponent; 
  @ViewChild('contactComponent') contactComponent;
  constructor(private router:Router,private userObj:User,private activatedRoute:ActivatedRoute) {
    let currentUrl = this.router.url;
    if(currentUrl == '/link-expired'){
        this.isExpired      =   true;
    }else if(currentUrl == '/account-activated'){
        this.isActivated    =   true;
    } 
    setTimeout(function() {
       this.isExpired    = false;
       this.isActivated  = false;
   }.bind(this), 5000);
   if(activatedRoute.snapshot.url.length > 0 ){
        this.isResetPassword = activatedRoute.snapshot.url[0].path;
   }

  }

  ngOnInit() {
    $(document).ready(function() {
        $('.dropdown-alted >ul').click(function(e) {
            e.stopPropagation();
        });
    });
    //var type = window.location.hash.substr(1);
    if(this.isResetPassword == "reset-password"){
        $('#forgetPassword').modal('show');
    }else{
       $('#forgetPassword').modal('hide');
    }
  }
  
  onLoginClick(){
    this.loginComponent.resetForm();
    this.errorMsg = "clear";
    this.userObj.socialLoginError(this.errorMsg);
  }
  onRegister(){ 
        //alert('1');
        this.registerComponent.resetRegForm();
        this.errorMsg = "clear";
        this.userObj.socialLoginError(this.errorMsg);
  }
  onContact(){ 
        //alert('1');
        this.contactComponent.resetForm();
  }

}
