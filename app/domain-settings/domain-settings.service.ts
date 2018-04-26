import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class DomainSettingsService {

  constructor(private http: Http) { }

  getdomainsettings(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'domain_settings/get_domain_details', JSON.stringify(params)); 
  }

  save_domain_details(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'domain_settings/save_domain_details', JSON.stringify(params));
  }
  UploadImage(formData:FormData){
      let headers = new Headers({'Content-Type' :'application/json'});
      let options = new RequestOptions ({ headers : headers ,method : 'post'});
      return  this.http.post(Config.BASE_API_URL+'domain_settings/image_upload' ,formData);
  }

}
