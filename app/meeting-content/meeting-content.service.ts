import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class MeetingContentService{

    constructor(private http: Http){}
    listMeetingTemplates(params){
        
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_templates/list_meeting_templates' ,params,options);
    } 

    getTemplateInfo(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_templates/get_meeting_template_info' ,params,options);
    }

    // listDefaultAudios(token){
    listDefaultAudios(params){
        // Changed - 16/11/2017
        // console.log(token)
        // var params ={ "token" : token };
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_templates/get_default_audios' ,params,options);
    }

    saveTemplateInfo(formData:FormData){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_templates/save_meeting_template' ,formData);
    }
    meeting_templates_info(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_templates/get_meetingtemp_info' ,params,options);
   
    }
    saveMeetingTemplateInfo(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return  this.http.post(Config.BASE_API_URL+'meeting_templates/save_meetingtemp_info' ,params,options);
   
    }

}