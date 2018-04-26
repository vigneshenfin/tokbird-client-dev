import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class MeetingReportsService {

  constructor(private http: Http) { }

  /**
   * Get poll used in a meeting
   * @param params 
   */
  polls(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_meeting_polls', JSON.stringify(params)); 
  }

  /**
   * Get poll answers
   * @param params 
   */
  poll_answers(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_poll_answers', JSON.stringify(params)); 
  }

  /**
   * Get poll questions
   * @param params 
   */
  pollQuestions(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_questions', JSON.stringify(params)); 
  }

  /**
   * Get poll question and answers
   * @param params 
   */
  pollQuestionAnswers(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_question_answers', JSON.stringify(params)); 
  }

  /**
   * Get poll question and answers
   * @param params 
   */
  meetingPollDetails(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_meeting_poll_details', JSON.stringify(params)); 
  }

  /**
   * Export poll question and answers - PDF&CSV
   * @param params 
   */
  pollsExport(params) {
    return this.http.post(Config.BASE_API_URL+'polls/export_polls', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  // Added from - reports service - 29/11/2017
  /**
   * Get dashboard details
   * @param params 
   */
  getDashboard(params){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/dashboard_details', JSON.stringify(params)); 
  }

  /**
   * Get attendees in a meeting
   * @param params 
   */
  attendance(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/attendance', JSON.stringify(params)); 
  }

  /**
   * Export dashboard details - CSV & PDF
   * @param params 
   */
  dashboardExport(params) {
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_dashboard', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
       if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  /**
   * Get attendee locations
   */
  locations(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/locations', JSON.stringify(params)); 
  }

  /**
   * Export locations - PDF
   * @param params 
   */
  locationPdf(params) {
    params.export_type = "pdf";
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_locations', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' })
    })
  }

  /**
   * Export locations - CSV
   * @param params 
   */
  locationCsv(params) {
    params.export_type = "csv";
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_locations', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'text/csv' });
    })
  }

  /**
   * Export locations - CSV & PDF
   * @param params 
   */
  locationsExport(params) {
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_locations', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  /**
   * Export attendees in a meeting - CSV & PDF
   * @param params 
   */
  attendanceExport(params) {
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_attendance', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  /**
   * Check access permission to meeting reports
   * @param params 
   */
  checkAccess(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/index', JSON.stringify(params)); 
  }

  /**
   * Check access permission to question and answers
   * @param params 
   */
  checkQaAccess(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/questions_answers', JSON.stringify(params)); 
  }

  /**
   * Get are you there details in a meeting
   * @param params 
   */
  areYouThere(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/are_you_there', JSON.stringify(params)); 
  }

  /**
   * Export are you there details - CSV & PDF
   * @param params 
   */
  areYouThereExport(params){
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_are_you_there', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  /**
   * Export question and answers - CSV & PDF
   * @param params 
   */
  qAndAExport(params){
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_q_and_a', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  /**
   * Get poll answer details of a question in meeting - without server side pagination
   * @param params 
   */
  pollAnswersReport(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/get_answers_report', JSON.stringify(params)); 
  }

  /**
   * Get poll question details of a question in meeting - with server side pagination
   * @param params 
   */
  pollQuestionReport(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/question_report', JSON.stringify(params)); 
  }

  /**
   * Get poll answer details of a question in meeting - with server side pagination
   * @param params 
   */
  pollQuestionAnswersReport(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'polls/answers_report', JSON.stringify(params)); 
  }

  /**
   * Export poll answers - CSV & PDF
   * @param params 
   */
  exportPollAnswers(params) {
    return this.http.post(Config.BASE_API_URL+'polls/export_answers', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
      (res) => {
          return new Blob([res.blob()], { type: 'text/csv' });
      })
  }

  /**
   * Export poll consolidated report
   * @param params 
   */
  exportConsolidated(params) {
    return this.http.post(Config.BASE_API_URL+'polls/consolidated_report', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
      (res) => {
          return new Blob([res.blob()], { type: 'text/csv' });
      })
  }

}
