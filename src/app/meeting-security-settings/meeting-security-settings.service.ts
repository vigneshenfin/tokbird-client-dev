import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class MeetingSecuritySettingsService{

    constructor(private http: Http){}
    getSecurityInfo(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_security/get_settings' ,params,options);
    } 

    saveSecurityInfo(securityInfo){
     
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_security/save_settings' ,securityInfo,options);
    }

   

}