import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class AdminLoginService{
    constructor(private http: Http){}
    validateLogin(loginInfo:NgForm){
        console.log(loginInfo.value)
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'accounts/login' ,JSON.stringify(loginInfo.value),options);
    } 
}