import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
@Injectable()
export class ListViewService {
    constructor(private http: Http){}
    getMeetings(params) {
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/get_meetings', JSON.stringify(params)); 
    }
}