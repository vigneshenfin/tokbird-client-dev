import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class InviteUsersService {

  constructor(private http: Http) { }

  /**
   * Get invitation content based on user role (Attendee, Presenter, Expert)
   * @param invitationParams 
   */
  getInvitationContent(invitationParams) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'invitations/invitation_content', JSON.stringify(invitationParams)); 
  }

  /**
   * Save invitation content of a user role (Attendee, Presenter, Expert)
   * @param invitationParams 
   */
  saveInvitationContent(invitationParams) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'invitations/save_invitation_content', JSON.stringify(invitationParams));
  }

  /**
   * Send invitation to email addresses
   * @param formData 
   */
  sendInvitation(formData:FormData) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'invitations/send_invitation',formData);
  }

  /**
   * Send invitation to email addresses
   * @param formData 
   */
  meetingInviteUsers(formData:FormData) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'invitations/invite_users',formData);
  }

  /**
   * Update invitation - save host details while enter meeting - latitude, longitude, place
   * @param params 
   */
  updateInvitation(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'invitations/update_invitation', JSON.stringify(params)); 
  }

  /**
   * Get user meeting details
   * @param params 
   */
  getUserMeeting(params) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'meetings/get_user_meeting', JSON.stringify(params)); 
  }

  /**
   * Get invitation content and invited users based on role - new requirement
   * @param params 
   */
  getInvitationDetails(params) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'invitations/get_invitation_details', JSON.stringify(params)); 
  }


}
