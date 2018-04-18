import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class PollsService {

  constructor(private http: Http) { }

  /**
   * Get polls
   * @author Paul P Elias
   * @param params 
   */
  getPolls(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_polls', JSON.stringify(params)); 
  }

  /**
   * Delete poll
   * @author Paul P Elias
   * @param params 
   */
  deletePoll(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/delete_poll', JSON.stringify(params)); 
  }

  /**
   * Save poll
   * @author Paul P Elias
   * @date 2017-10-20
   * @param params 
   */
  savePoll(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/save_poll', JSON.stringify(params)); 
  }

  getPoll(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_poll', JSON.stringify(params)); 
  }

  getQuestions(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_questions', JSON.stringify(params));
  }

  getPollDetails(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_poll_details', JSON.stringify(params));
  }

}
