import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class ProfileService{

    constructor(private http: Http){}
    getSubscriptionPlans(params){
        
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'subscription_plans/get_plans' ,params,options);
    } 

    getPaymentOptions(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'subscription_plans/get_plan_payments' ,params,options);
    }

    getUserDetails(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'profile/get_profile_details' ,params,options);
    }

    resetPassword(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'profile/reset_password' ,params,options);
    }
    checkCurrentPassword(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'profile/check_current_pwd' ,params,options);
   
    }
    UploadProfileImage(formData:FormData){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'profile/image_upload' ,formData);
    }

    saveProfileData(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'profile/save_profile_details' ,params,options);
    }
    updatePlanDetails(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'subscription_plans/update_user_plan' ,params,options);
    }
    requestCorporatePlan(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'subscription_plans/request_corporate' ,params,options);
    }

}