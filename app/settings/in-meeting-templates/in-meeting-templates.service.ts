import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class InMeetingTemplatesService {

  constructor(private http:Http) { }

  deleteMeetingTemplate(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_templates/delete_meeting_template', JSON.stringify(params));
  }

  getThemeDetails(params){
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_templates/get_theme_details', params);
  }


}
