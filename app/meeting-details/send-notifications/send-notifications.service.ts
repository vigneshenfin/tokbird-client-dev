import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class SendNotificationsService {

  constructor(private http: Http) { }

  /**
   * Send notification - Future meetings
   * @param formInfo 
   */
  sendNotification(formInfo:NgForm){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/send_notification' ,JSON.stringify(formInfo.value),options);
 }

 /**
  * Send notifications - Past meetings
  * @param formInfo 
  */
 sendPastNotification(formInfo:NgForm){
     let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'past_send_notifications/send_notification' ,JSON.stringify(formInfo.value),options);
 }

}
