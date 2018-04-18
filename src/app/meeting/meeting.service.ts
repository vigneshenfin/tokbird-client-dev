import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
@Injectable()
export class MeetingService {
    constructor(private http: Http){}
    getMeeting(params) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/get_meeting', JSON.stringify(params)); 
    }

    cancelMeeting(params) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/cancel_meeting', JSON.stringify(params));
    }

    sendCancellation(params) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/send_cancellation', JSON.stringify(params));
    }

}