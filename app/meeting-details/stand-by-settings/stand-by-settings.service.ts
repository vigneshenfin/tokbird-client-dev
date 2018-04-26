import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class StandBySettingsService {

  constructor(private http: Http) { }

  /**
   * Save location settings of a meeting
   * @param formData 
   */
  saveStandBySettings(formData:FormData) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'standby_settings/save_settings',formData);
  }

  /**
   * Get location settings of a meeting
   * @param params 
   */
  getStandBySettings(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'standby_settings/get_settings', JSON.stringify(params));
  }

}
