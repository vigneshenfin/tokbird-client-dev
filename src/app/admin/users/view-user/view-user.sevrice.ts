import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class ViewUserService{

    constructor(private http: Http){}
    
    getUserDetails(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'users/get_user_info' ,params,options);
    }

    saveUserData(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'users/save_user_info' ,params,options);
    }
    updatePlanDetails(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'subscription_plans/update_user_plan' ,params,options);
    }
    getBasicInfo(params){
         
          let headers = new Headers({'Content-Type' :'application/json'});
          let options = new RequestOptions ({ headers : headers ,method : 'post'});
          return  this.http.post(Config.BASE_API_URL+'users/get_user_info' ,params,options);
    }
    
}