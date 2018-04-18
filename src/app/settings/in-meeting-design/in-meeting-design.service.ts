import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class InMeetingDesignService {

  constructor(private http:Http) { }

  saveMeetingDesign(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_design/save_theme_details', params);
  }

  uploadFontFile(formData){
    let headers = new Headers({'Content-Type' :'application/json'});
    let options = new RequestOptions ({ headers : headers ,method : 'post'});
    return  this.http.post(Config.BASE_API_URL+'meeting_design/font_upload' ,formData);
  }

  getThemeDetails(params){
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_design/get_theme_details', params);
  }

}
