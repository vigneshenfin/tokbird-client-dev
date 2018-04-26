import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class MeetingUsersService {

  constructor(private http: Http) { }

  /**
   * Get users of a meeting
   * @param params 
   */
  getUsers(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'invitations/get_invited_users', JSON.stringify(params)); 
  }

  /**
   * Export users as CSV
   * @param params 
   */
  exportCsv(params) {
    params.export_type = "csv";
    return this.http.post(Config.BASE_API_URL+'invitations/export_users', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'text/csv' });
    })
  }

  /**
   * Get schedule details of a meeting
   */
  getSchedules(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'schedules/get_schedules', JSON.stringify(params)); 
  }
  
}
