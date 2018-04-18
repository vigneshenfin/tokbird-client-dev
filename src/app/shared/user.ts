import {Injectable,EventEmitter} from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class User {
  public isFirstTimeFlag = false;
  public onLogoutEvent: EventEmitter<any>;
  public updateProPicEvent: EventEmitter<any>;
  public updateErrorEvent: EventEmitter<any>;
  public updateLogoEvent: EventEmitter<any>;
  constructor(private router: Router) {
        this.onLogoutEvent          = new EventEmitter();
        this.updateProPicEvent      = new EventEmitter();
        this.updateErrorEvent       = new EventEmitter();
        this.updateLogoEvent        = new EventEmitter();
  }
  putUser(userData) {
        this.isFirstTimeFlag = true;
        var jsdata = JSON.stringify(userData);
        //alert(jsdata);
        localStorage.setItem('user', jsdata); 
        this.setBrowserSessionEnabled('true');
  }
  setBrowserSessionEnabled(enabled){
        document.cookie="enabled="+enabled
  }
  getUser(){
       if (localStorage.getItem('user')) {
            
            return JSON.parse(localStorage.getItem('user'));
        }else{
           this.router.navigate(['/']);
           return false;
        }
  }
  getUserWithoutSessionCheck(){
       if (localStorage.getItem('user')) {
            return JSON.parse(localStorage.getItem('user'));
        }else{
           return false;
        }
  }
  isLoggenIn(){
       if (localStorage.getItem('user')) {
            return true;
        }else{
           return false;
        }
  }
  
  logOut(){
       localStorage.removeItem('user');
       this.onLogoutEvent.emit('logout');
  }
  logoUpdateEvent(pic){
      this.updateLogoEvent.emit(pic);
  }
  proPicUpdateEvent(pic){
       this.updateProPicEvent.emit(pic);
  }

  socialLoginError(msg){
      if(msg){
         this.updateErrorEvent.emit(msg);
      }
      
  }
  
}