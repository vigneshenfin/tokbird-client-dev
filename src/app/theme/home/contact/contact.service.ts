import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class ContactService{
    constructor(private http: Http){}
    requestCorporatePlan(contactInfo:NgForm){
        console.log(contactInfo.value)
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'subscription_plans/request_corporate' ,JSON.stringify(contactInfo.value),options);
    }
}