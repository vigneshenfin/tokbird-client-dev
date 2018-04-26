import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
@Injectable()
export class CalendarViewService {
    constructor(private http: Http){}
    getMonthlyMeetings(params) {
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/monthly_meetings', JSON.stringify(params)); 
    }
    
    getMonthlyEvents(params) {
        return [
          {
            "title": "All Day Event",
            "start": "2017-09-01"
          },
          {
            "title": "Long Event",
            "start": "2017-09-07",
            "end": "2017-09-10"
          },
          {
            "id": 999,
            "title": "Repeating Event",
            "start": "2016-09-09T16:00:00"
          },
          {
            "id": 999,
            "title": "Repeating Event",
            "start": "2016-09-16T16:00:00"
          },
          {
            "title": "Conference",
            "start": "2016-09-11",
            "end": "2016-09-13"
          },
          {
            "title": "Meeting",
            "start": "2016-09-12T10:30:00",
            "end": "2016-09-12T12:30:00"
          },
          {
            "title": "Lunch",
            "start": "2016-09-12T12:00:00"
          },
          {
            "title": "Meeting",
            "start": "2016-09-12T14:30:00"
          },
          {
            "title": "Happy Hour",
            "start": "2016-09-12T17:30:00"
          },
          {
            "title": "Dinner",
            "start": "2016-09-12T20:00:00"
          },
          {
            "title": "Birthday Party",
            "start": "2016-09-13T07:00:00"
          },
          {
            "title": "Click for Google",
            "url": "http://google.com/",
            "start": "2016-09-28"
          }
        ];
    }
}