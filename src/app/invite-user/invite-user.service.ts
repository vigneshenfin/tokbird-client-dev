import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
@Injectable()
export class InviteUserService {
    constructor(private http: Http){}
    getInvitationContent(invitationParams) {
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'invitations/invitation_content', JSON.stringify(invitationParams)); 
    }

    saveInvitationContent(invitationParams) {
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'invitations/save_invitation_content', JSON.stringify(invitationParams));
    }

    sendInvitation(formData:FormData) {
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'invitations/send_invitation',formData);
    }
    
}