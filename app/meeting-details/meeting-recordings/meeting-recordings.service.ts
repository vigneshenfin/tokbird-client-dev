import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
import * as FileSaver from 'file-saver';
import 'rxjs/Rx';

@Injectable()
export class MeetingRecordingsService {

  constructor(private http: Http) { }

  /**
   * Get recordings of a meeting
   * @param params 
   */
  recordings(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'recordings/get_recordings', JSON.stringify(params)); 
  }

  /**
   * Delete meeting recording
   * @param params 
   */
  deletRecording(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'recordings/delete_recording', JSON.stringify(params)); 
  }

  /**
   * Update on demand join/leave time while playing recording
   * @param params 
   */
  updateRecordingTime(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'invitations/update_recording_time', JSON.stringify(params));
  }

}
