import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from 'app/config/config';

@Injectable()
export class AllEventsCalendarService {

  constructor(private http: Http) { }

  getEvents(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'events/get_all_events', JSON.stringify(params));
  }

  getEvent(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'events/get_event', JSON.stringify(params));
  }

}
