import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from 'app/config/config';

@Injectable()
export class QuestionsAnswersService {

  constructor(private http: Http) { }

  getAllQuestions(params)
  {
    let meetingId = params['meetingId'];
    let scheduleId = false;
    if(params['scheduleId']){
      if(params['scheduleId'] != ''){
        scheduleId = params['scheduleId'];
      }
    }
    //meetingId = 922074;
    // let headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    // let options = new RequestOptions({ headers: headers });
    // return this.http.get(Config.CONFERENCE_API_URL+'get-all-question/'+meetingId, options); 
   // return this.http.get(Config.CONFERENCE_API_URL+'get-all-questions/'+meetingId);
    // return this.http.get(Config.CONFERENCE_API_URL+'get-all-questions/'+meetingId);
    return this.http.get(Config.CONFERENCE_API_URL+'get-all-questions/'+meetingId+'/'+scheduleId);
  }

  // getAll(params){
  //   let meetingId = params['meetingId'];
  //   let questions = this.http
  //     .get(Config.CONFERENCE_API_URL + 'get-all-question/'+ meetingId, {headers: this.getHeaders()})
  //     .map(mapPersons);
  //     return people$;
  // }

  private getHeaders(){
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

}
