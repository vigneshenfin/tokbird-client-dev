import { Injectable } from '@angular/core';
import { Http,RequestOptions,Headers } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from 'app/config/config';

@Injectable()
export class AssignPollsService{

    constructor(private http:Http){
    }

    /**
     * Get assigned polls of a meeting
     * @param params 
     */
    getAssignedPolls(params){
        let headers  = new Headers({'Content-Type': 'application/json'});
        let options  = new RequestOptions({headers:headers ,method :'post'});
        return this.http.post(Config.BASE_API_URL+'polls/get_assigned_polls',params,options);
    }

    /**
     * Delete assigned poll
     * @param params 
     */
    deletePoll(params){
        let headers  = new Headers({'Content-Type': 'application/json'});
        let options  = new RequestOptions({headers:headers ,method :'post'});
        return this.http.post(Config.BASE_API_URL+'polls/delete_assigned_poll',params,options);
    }

    /**
     * Get polls
     * @param params 
     */
    getPolls(params) {
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'polls/get_polls', JSON.stringify(params)); 
   }

   /**
    * Assign poll to a meeting 
    * @param params 
    */
   assignPoll(params){
        let headers     = new Headers({'Content-Type': 'application/json'});
        let options     = new RequestOptions({headers: headers, method: 'post'});
        return this.http.post(Config.BASE_API_URL+'polls/assign_poll', JSON.stringify(params)); 
   }

}