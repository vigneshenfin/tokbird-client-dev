import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';

@Injectable()
export class LearnersService {

  constructor(private http: Http) { }

  /**
   * Get learners
   */
  getLearners(params)
  {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'learners/get_learners', JSON.stringify(params)); 
  }

  /**
   * Upload learners
   * @param formData 
   */
  uploadLearners(formData:FormData)
  {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'learners/upload_learners', formData); 
  }

  /**
   * Get learner
   */
  getLearner(params)
  {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'learners/get_learner', JSON.stringify(params)); 
  }

}
