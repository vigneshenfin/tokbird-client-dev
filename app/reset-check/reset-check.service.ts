import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class ResetCheckService{
    constructor(private http: Http){}
    resetPassword(resetInfo:NgForm,token){
        var resetData       = {'token': token,'new_password':resetInfo.value.npassword };
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'accounts/reset_password' ,JSON.stringify(resetData),options);
    }
}