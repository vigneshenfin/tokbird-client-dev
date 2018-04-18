import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class SocialLoginService{
    constructor(private http: Http){}
    socialUserLogin(registerInfo){
        //console.log(registerInfo)
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'accounts/social_register' ,JSON.stringify(registerInfo),options);
    }
}