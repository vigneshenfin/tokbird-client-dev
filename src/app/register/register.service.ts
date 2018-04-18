import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class RegisterService{
    constructor(private http: Http){}
    registerUser(registerInfo:NgForm){
        //console.log(registerInfo.value)
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'accounts/register' ,JSON.stringify(registerInfo.value),options);
    }
}