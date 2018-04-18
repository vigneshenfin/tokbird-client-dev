import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from "app/config/config";

@Injectable()

export class ScheduleService {

    constructor( private http: Http){}

    /**
     * Save meeting
     * @param meetingInfo 
     */
    createMeeting(meetingInfo:NgForm){
        let headers     = new Headers({ 'Content-Type': 'application/json' });
        let options     = new RequestOptions({ headers: headers, method: "post" });
        return this.http.post(Config.BASE_API_URL+'meetings/save', JSON.stringify(meetingInfo.value), options);
    }

    /**
     * Invite host after schedule meeting
     * @param params 
     */
    inviteHost(params){
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'invitations/invite_host', JSON.stringify(params)); 
    }

    /**
     * Save after event url
     * @param params 
     */
    saveAfterEventUrl(params){
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/save_after_event', JSON.stringify(params)); 
    }

    /**
     * Update past meeting
     */
    updatePastMeeting(meetingInfo:NgForm){
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/update_past_meeting', JSON.stringify(meetingInfo.value), options);
    }
}