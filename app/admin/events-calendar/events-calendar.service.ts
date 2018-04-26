import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class EventsCalendarService {

  constructor(private http: Http) { }

  /**
   * Get meetings for calendar
   * @param params 
   */
  getMeetingsCalendar(params){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meetings/get_meetings_calendar', JSON.stringify(params));
  }

  /**
   * Get meetings for a day
   * @param params 
   */
  getMeetingsDay(params){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meetings/get_meetings_day', JSON.stringify(params));
  }

}
