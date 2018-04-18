import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class ForgotService{
    constructor(private http: Http){}
    sendResetPwdLink(mailInfo:NgForm){
        console.log(mailInfo.value)
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'accounts/forgot_password' ,JSON.stringify(mailInfo.value),options);
    }
}