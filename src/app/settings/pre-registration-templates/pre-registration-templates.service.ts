import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()

export class PreRegistrationTemplatesService {

  constructor(private http:Http) { }

  /**
   * Get pre registration templates
   * @param params 
   */
  getRegistrationTemplates(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers':headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'registration_templates/get_templates', JSON.stringify(params));
  }

  /**
   * Get registration templates
   * @param params 
   */
  getRegistrationTemplatesSettings(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers':headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'registration_templates/get_templates_settings', JSON.stringify(params));
  }

  /**
   * Get default pre registration template fields
   * @param params 
   */
  getDefaultTemplates(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'registration_templates/get_default_fields', JSON.stringify(params))
  }

  /**
   * Save pre registration template
   * @param params 
   */
  saveRegistrationTemplate(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    // return this.http.post(Config.BASE_API_URL+'registration_templates/save', JSON.stringify(params))
    return this.http.post(Config.BASE_API_URL+'registration_templates/save', params);
  }

  /**
   * Get details of a pre registration template
   * @param params 
   */
  getRegistrationTemplate(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'registration_templates/get_template_details', JSON.stringify(params));
  }

  /**
   * Delete pre registration template
   * @param params 
   */
  deleteRegistrationTemplate(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'registration_templates/delete_template', JSON.stringify(params));
  }

  /**
   * Save pre registration template of a meeting
   * @param params 
   */
  saveMeetingTemplate(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers': headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'meetings/save_registration_template', JSON.stringify(params));
  }

  /**
   * Get registration templates and no meeting template of a meeting
   * @param params 
   */
  getRegistrationTemplatesMeeting(params) {
    let headers = new Headers({'Content-type': 'application/json'});
    let options = new RequestOptions({'headers':headers, 'method': 'post'});
    return this.http.post(Config.BASE_API_URL+'registration_templates/get_templates_meeting', JSON.stringify(params));
  }

}
