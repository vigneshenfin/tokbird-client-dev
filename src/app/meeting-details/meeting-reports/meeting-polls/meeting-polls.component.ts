import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MeetingReportsService } from 'app/meeting-details/meeting-reports/meeting-reports.service';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import 'rxjs/Rx'; 
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from 'app/shared/user';

declare var $:any;
declare var saveAs:any;

@Component({
  selector: 'app-meeting-polls',
  templateUrl: './meeting-polls.component.html',
  styleUrls: ['./meeting-polls.component.css'],
  providers: [MeetingReportsService]
})
export class MeetingPollsComponent implements OnInit {

  @Input() meetingId;
  @Output() pollChanged = new EventEmitter();
  @Input() routeMeetingId;
  @Input() accessDenied;
  @Input() allDataFetchedReports;
  private _scheduleId: string;
  @Input() set scheduleId(value: string) {
   this._scheduleId = value;
   if(!this.loadPolls){
     this.filterSchedule(this._scheduleId);
   }
  }
  get scheduleId(): string {
      return this._scheduleId;
  }
  public polls:any = [];
  public pollDetails:any = [];
  public userDetails:any = {};
  public selectedPoll = '';
  public pollDetailsArray:any = [];
  public pollAnswerDetails:any = [];
  public limit = 10;
  public offset = 1;
  public p:number = 1;
  busy: Subscription;
  // For server side pagination
  public questionDetails:any = {};
  public answerDetails:any = [];
  public recordDetails:any = [];
  public questionId;
  public pollTitle = '';
  public loadPolls:boolean = true;

  constructor(private user: User, private router:Router, private activatedRoute:ActivatedRoute, private meetingReportsService:MeetingReportsService) { 
    this.userDetails   = user.getUser();
  }

  ngOnInit() {
  }

  /**
   * Get poll results when schedule changes
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    if(this.meetingId != '' && !this.accessDenied && this.allDataFetchedReports && this.loadPolls){
      let params:any = {};
      params.meeting_id = this.meetingId;
      params.token = this.userDetails.token;
      this.getPolls(params);
    }
    if(!changes.scheduleId.firstChange){
    }
  }

  /**
   * Get poll details
   */
  filterSchedule(schId=''){
    if(this.selectedPoll){
      let params:any ={};
      params.meeting_id = this.meetingId;
      params.poll_id = this.selectedPoll;
      params.token = this.userDetails.token;
      params.schedule_id = this.scheduleId;
      this.getMeetingPollDetails(params);
    }
  }
  
  /**
   * Get polls used in meeting
   */
  getPolls(params) {
    params.route_meeting_id = this.routeMeetingId;
    this.meetingReportsService.polls(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.loadPolls = false;
          this.polls = response.body.polls;
          if(this.polls.length > 0){
            if(this.polls[0]){
              this.selectedPoll = this.polls[0].id;
              let params:any ={};
              params.meeting_id = this.meetingId;
              params.poll_id = this.polls[0].id;
              params.token = this.userDetails.token;
              params.schedule_id = this.scheduleId;
              this.getMeetingPollDetails(params);
            }
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    )
  }

  /**
   * Get meeting poll details
   * @param params 
   */
  getMeetingPollDetails(params) {
    params.route_meeting_id = this.routeMeetingId;
    this.meetingReportsService.meetingPollDetails(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        this.pollDetails = [];
        if(response.success == 1){
          this.pollChanged.emit(this.selectedPoll); // emit the selected poll.
          let pollQuestions = response.body.poll_questions;
          let pollAnswers = response.body.poll_answers;
          let answers:any = {};
          let maxUsers = 0;
          for(let i=0; i<pollAnswers.length; i++){
            let key = pollAnswers[i].question_id;
            let inviteesCount = pollAnswers[i].invited_users_count;
            answers[key] = pollAnswers[i];
            if(inviteesCount > maxUsers){
              maxUsers = inviteesCount;
            }
          }
          let answersArray:any = [];
          for(let i=0; i<pollQuestions.length; i++){
            let questionId = pollQuestions[i].id;
            let instances:any = {};
            if((answers[questionId]) && (answers[questionId].answers != '')){
              let qAnswers:any = answers[questionId].answers.split(',');
              for(let j=0; j<qAnswers.length; j++){
                let key = qAnswers[j];
                instances[key] = (instances[key]) ? instances[key] + 1 : 1 ;
              }
            }
            let answer:any = {};
            answer.questionId = pollQuestions[i].id;
            answer.question = pollQuestions[i].question;
            let qOptions:any = JSON.parse(pollQuestions[i].options);
            let options:any = [];
            for(let k=0; k<qOptions.length; k++){
              let option:any = {};
              option.value = qOptions[k].value;
              option.label = qOptions[k].label;
              option.percentage = 0;
              option.usersCount = 0;
              if((!this.isEmpty(instances)) && (maxUsers > 0)){
                let instance = 0;
                if(instances[option.value]){
                  instance = instances[option.value];
                  option.percentage = (instance/maxUsers)*100;
                  option.usersCount = instance;
                }
              }
              options.push(option);
            }
            answer.options = options;
            answersArray.push(answer);
          }
          this.pollDetailsArray = answersArray;
          let meetingPollDetails:any = [];
          let totalCount = 0;
          for(let i=0; i<meetingPollDetails.length; i++){
            let detailObj:any = {};
            detailObj.question = meetingPollDetails[i].question;
            detailObj.type = meetingPollDetails[i].question_type;
            detailObj.options = JSON.parse(meetingPollDetails[i].options);
            let answers:any = [];
            if(meetingPollDetails[i].answers){
              answers = meetingPollDetails[i].answers.split(',');
            }
            let pollNoOfVotes = 0;
            for(let j=0; j<detailObj.options.length; j++){
              let target = detailObj.options[j].value;
              var numOccurences = $.grep(answers, function (elem) {
                  return elem == target;
              }).length; // Returns 2
              detailObj.options[j].count = numOccurences;
              totalCount += numOccurences;
              pollNoOfVotes += numOccurences;
            }
            detailObj.totalVotes = pollNoOfVotes;
            detailObj.ansUsersCount = meetingPollDetails[i].ans_users_count;
            this.pollDetails.push(detailObj);
          }
        }
      }
    )
  }

  /**
   * Check empty
   * @param obj 
   */
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  /**
   * Get poll details
   * @param pollId 
   */
  getPollDetails(pollId) {
    let params:any = {};
    params.meeting_id = this.meetingId;
    params.schedule_id = this.scheduleId;
    params.poll_id = pollId;
    params.token = this.userDetails.token;
    this.getMeetingPollDetails(params);
  }

  /**
   * View details of a poll question - without server side pagination
   * @param questionId
   */
  viewDetails(questionId) {
    if((this.selectedPoll != '') && (questionId != '')){
      let params:any = {};
      params.meeting_id = this.meetingId;
      params.schedule_id = this.scheduleId;
      params.poll_id = this.selectedPoll;
      params.question_id = questionId;
      params.token = this.userDetails.token;
      this.meetingReportsService.pollAnswersReport(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.processPollAnswerDetails(response.body.results);
            $("#poll-answer-details-modal").modal({'show': true});
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }
        }
      )
    }
  }

  /**
   * Manage poll answer details - without serverside pagination
   * @param answerDetails 
   */
  processPollAnswerDetails(answerDetails) {
    let pollQuestion = answerDetails.question;
    let pollAnswers = answerDetails.answers;
    let qanswerDetails:any = {};
    qanswerDetails.question = pollQuestion.question;
    qanswerDetails.questionType = pollQuestion.question_type;
    qanswerDetails.options = JSON.parse(pollQuestion.options);
    qanswerDetails.answer = pollQuestion.answer;
    let qanswers:any = [];
    for(let i=0; i<pollAnswers.length; i++){
      let qanswer:any = {};
      let inviteeDetails:any = [];
      if(pollAnswers[i].details){
        inviteeDetails= JSON.parse(pollAnswers[i].details);
      }
      let invitee = '';
      for(let j=0; j<inviteeDetails.length; j++){
        if(inviteeDetails[j].field == 'first_name'){
          invitee += inviteeDetails[j].value;
        }
        if(inviteeDetails[j].field == 'last_name'){
          invitee += ' ' + inviteeDetails[j].value;
        }
      }
      let questionAnswer   = pollQuestion.answer;
      let answerArray = [];
      if(questionAnswer){
        answerArray = questionAnswer.split(',').map(function(item) {
            return parseInt(item, 10);
        });
      }
      let optionsObj:any = {};
      let pollOptions = JSON.parse(pollQuestion.options);
      if(pollOptions.length > 0){
        for(let m=0; m<pollOptions.length; m++){
          let optionValue =  pollOptions[m].value;
          optionsObj[optionValue] = pollOptions[m].label;
          qanswerDetails.options[m].checked = false;
          if(answerArray.indexOf((qanswerDetails.options[m].value)) >= 0){
            qanswerDetails.options[m].checked = true;
          }
        }
      }
      qanswer.user = invitee;
      switch(pollQuestion.question_type){
        case '1': { // Multiple choice question
          qanswer.userAnswer = '';
          qanswer.userPoints = 0;
          if(answerArray.length > 0){ // If answer for this question is not empty
            let pollAnswersLength = answerArray.length;
            let userAnswerArray = [];
            if(pollAnswers[i].answer){ // If invited user answer is not null
              userAnswerArray = pollAnswers[i].answer.split(',').map(function(item) {
                  return parseInt(item, 10);
              });
              let correctAnswers = 0;
              let userAnswerOption:any = []; // For invited user option names
              for(let k=0; k<userAnswerArray.length; k++){ // Loop through invited user answers
                if(optionsObj[userAnswerArray[k]]){
                  userAnswerOption.push(optionsObj[userAnswerArray[k]]);
                }
                if(answerArray.indexOf((userAnswerArray[k])) >= 0){ // Invited user array matches with question correct answer
                  correctAnswers ++;
                }
              }
              qanswer.userAnswer = userAnswerOption.join(); // Join invited user answer options
              if(pollAnswersLength > 0) {
                if((pollAnswersLength == userAnswerArray.length) && (pollAnswersLength == correctAnswers)){ // If all options match only
                  qanswer.userPoints = 1;
                }
              }
            }
          }
          break;
        }
        case '5': // Dropdown
        case '2': { // Single choice question
          qanswer.userAnswer = '';
          qanswer.userPoints = 0;
          if(answerArray.length > 0){ // If answer for this question is not empty
            let pollAnswersLength = answerArray.length;
            let userAnswerArray = [];
            if(pollAnswers[i].answer){ // If invited user answer is not null
              userAnswerArray = pollAnswers[i].answer.split(',').map(function(item) {
                  return parseInt(item, 10);
              });
              let correctAnswers = 0;
              let userAnswerOption:any = []; // For invited user option names
              if(userAnswerArray.length == 1){
                if(optionsObj[userAnswerArray[0]]){
                  userAnswerOption.push(optionsObj[userAnswerArray[0]]);
                }
                if(answerArray.indexOf((userAnswerArray[0])) >= 0){ // Invited user array matches with question correct answer
                  correctAnswers ++;
                }
              }
              qanswer.userAnswer = userAnswerOption.join(); // Join invited user answer options - here only one option
              if(correctAnswers == 1){
                qanswer.userPoints = 1;
              }
            }
          }
          break;
        }
        case '3': { // Textinput
          qanswer.userAnswer = pollAnswers[i].answer;
          qanswer.userPoints = 0;
          break;
        }
        case '4': { // Textarea
          qanswer.userAnswer = pollAnswers[i].answer;
          qanswer.userPoints = 0;
          break;
        }
        default: {
          qanswer.userAnswer = '';
          qanswer.userPoints = 0;
        }
      }
      qanswers.push(qanswer);
    }
    qanswerDetails.answers = qanswers;
    this.pollAnswerDetails = qanswerDetails;
  }

  // FOR SERVER SIDE PAGINATION

  /**
   * View details of a poll question - With server side pagination
   * @param questionId
   */
  viewAnswerDetails(questionId) {
    if((this.selectedPoll != '') && (questionId != '')){
      let params:any = {};
      params.meeting_id = this.meetingId;
      // Added - 27/03/2018
      params.route_meeting_id = this.routeMeetingId;
      params.schedule_id = this.scheduleId;
      params.poll_id = this.selectedPoll;
      params.question_id = questionId;
      params.token = this.userDetails.token;
      this.meetingReportsService.pollQuestionReport(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.questionId = questionId;
            this.pollTitle = response.body.poll_title;
            this.processPollQuestions(response.body.question);
            this.pollAnswers();
            $("#poll-answer-details-modal").modal({'show': true});
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }
        }
      )
    }
  }

  /**
   * Get answers of a poll question
   * @param params 
   */
  pollAnswers() {
    let params:any = {};
    params.poll_id = this.selectedPoll;
    params.meeting_id = this.meetingId;
    // Added -  27/03/2018
    params.route_meeting_id = this.routeMeetingId;
    params.schedule_id = this.scheduleId;
    params.question_id = this.questionId;
    params.limit = this.limit;
    params.offset = this.offset;
    params.token = this.userDetails.token;
    this.meetingReportsService.pollQuestionAnswersReport(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.p = this.offset;
          this.recordDetails = response.body.records;
          this.processPollAnswers(response.body.answers);
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    )
  }

  /**
   * Get poll answers when page changes
   * @param event 
   */
  pageChanged(event) {
    this.offset = event;
    this.pollAnswers();
  }

  /**
   * Manage poll question details - with server side pagination
   * @param questionDetails 
   */
  processPollQuestions(questionDetails) {
    let pollQuestionDetails:any = {};
    pollQuestionDetails.question = questionDetails.question;
    pollQuestionDetails.questionType = questionDetails.question_type;
    pollQuestionDetails.options = JSON.parse(questionDetails.options);
    pollQuestionDetails.answer = questionDetails.answer;
    let pollQuestionOptions = pollQuestionDetails.options;
    let pollQuestionAnswer = pollQuestionDetails.answer;
    let answerArray = [];
    if(pollQuestionAnswer){
      answerArray = pollQuestionAnswer.split(',').map(function(item) {
          return parseInt(item, 10);
      });
    }
    // For display percentage
    let optionDetails:any = [];
    for(let i=0; i<this.pollDetailsArray.length; i++) {
      if(this.pollDetailsArray[i].questionId == this.questionId){
        optionDetails = this.pollDetailsArray[i].options;
      }
    }
    if(pollQuestionOptions.length > 0){
      for(let m=0; m<pollQuestionOptions.length; m++){
        let optionValue =  pollQuestionOptions[m].value;
        pollQuestionDetails.options[m].checked = false;
        if(answerArray.indexOf((pollQuestionDetails.options[m].value)) >= 0){
          pollQuestionDetails.options[m].checked = true;
        }
        // For display percentage
        pollQuestionDetails.options[m].percentage = 0;
        pollQuestionDetails.options[m].usersCount = 0;
        for(let i=0; i<optionDetails.length; i++){
          if(optionDetails[i].value == optionValue){
            if(optionDetails[i].percentage){
              pollQuestionDetails.options[m].percentage = optionDetails[i].percentage;
              if(optionDetails[i].usersCount){
                pollQuestionDetails.options[m].usersCount = optionDetails[i].usersCount;
              }
            }
          }
        }
      }
    }
    this.questionDetails = {};
    this.questionDetails = pollQuestionDetails;
  }

  /**
   * Manage poll answer details - with server side pagination
   * @param answerDetails 
   */
  processPollAnswers(answerDetails) {
    let qanswers:any = [];
    for(let i=0; i<answerDetails.length; i++){
      let qanswer:any = {};
      let inviteeDetails:any = [];
      if(answerDetails[i].details){
        inviteeDetails= JSON.parse(answerDetails[i].details);
      }
      let invitee = '';
      for(let j=0; j<inviteeDetails.length; j++){
        if(inviteeDetails[j].field == 'first_name'){
          invitee += inviteeDetails[j].value;
        }
        if(inviteeDetails[j].field == 'last_name'){
          invitee += ' ' + inviteeDetails[j].value;
        }
      }
      let questionAnswer   = this.questionDetails.answer;
      let answerArray = [];
      if(questionAnswer){
        answerArray = questionAnswer.split(',').map(function(item) {
            return parseInt(item, 10);
        });
      }
      let optionsObj:any = {};
      let pollOptions = this.questionDetails.options;
      if(pollOptions.length > 0){
        for(let m=0; m<pollOptions.length; m++){
          let optionValue =  pollOptions[m].value;
          optionsObj[optionValue] = pollOptions[m].label;
        }
      }
      qanswer.user = invitee;
      switch(this.questionDetails.questionType){
        case '1': { // Multiple choice question
          qanswer.userAnswer = '';
          qanswer.userPoints = 0;
          // Changed condition
          // if(answerArray.length > 0){ // If answer for this question is not empty
            let pollAnswersLength = answerArray.length;
            let userAnswerArray = [];
            if(answerDetails[i].answer){ // If invited user answer is not null
              userAnswerArray = answerDetails[i].answer.split(',').map(function(item) {
                  return parseInt(item, 10);
              });
              let correctAnswers = 0;
              let userAnswerOption:any = []; // For invited user option names
              for(let k=0; k<userAnswerArray.length; k++){ // Loop through invited user answers
                if(optionsObj[userAnswerArray[k]]){
                  userAnswerOption.push(optionsObj[userAnswerArray[k]]);
                }
                if(answerArray.indexOf((userAnswerArray[k])) >= 0){ // Invited user array matches with question correct answer
                  correctAnswers ++;
                }
              }
              qanswer.userAnswer = userAnswerOption.join(); // Join invited user answer options
              if(pollAnswersLength > 0) {
                if((pollAnswersLength == userAnswerArray.length) && (pollAnswersLength == correctAnswers)){ // If all options match only
                  qanswer.userPoints = 1;
                }
              }
            }
          // }
          break;
        }
        case '5': // Dropdown
        case '2': { // Single choice question
          qanswer.userAnswer = '';
          qanswer.userPoints = 0;
          // Changed condition
          // if(answerArray.length > 0){ // If answer for this question is not empty
            let pollAnswersLength = answerArray.length;
            let userAnswerArray = [];
            if(answerDetails[i].answer){ // If invited user answer is not null
              userAnswerArray = answerDetails[i].answer.split(',').map(function(item) {
                  return parseInt(item, 10);
              });
              let correctAnswers = 0;
              let userAnswerOption:any = []; // For invited user option names
              if(userAnswerArray.length == 1){
                if(optionsObj[userAnswerArray[0]]){
                  userAnswerOption.push(optionsObj[userAnswerArray[0]]);
                }
                if(answerArray.indexOf((userAnswerArray[0])) >= 0){ // Invited user array matches with question correct answer
                  correctAnswers ++;
                }
              }
              qanswer.userAnswer = userAnswerOption.join(); // Join invited user answer options - here only one option
              if(correctAnswers == 1){
                qanswer.userPoints = 1;
              }
            }
          // }
          break;
        }
        case '3': { // Textinput
          qanswer.userAnswer = answerDetails[i].answer;
          qanswer.userPoints = 0;
          break;
        }
        case '4': { // Textarea
          qanswer.userAnswer = answerDetails[i].answer;
          qanswer.userPoints = 0;
          break;
        }
        default: {
          qanswer.userAnswer = '';
          qanswer.userPoints = 0;
        }
      }
      qanswers.push(qanswer);
    }
    this.answerDetails = qanswers;
  }

  /**
   * Export poll answers csv
   */
  exportCsv() {
    if(this.meetingId != '' && this.selectedPoll != '' && this.questionId != ''){
      let params:any = {};
      params.meeting_id = this.meetingId;
      // Added - 27/03/2018
      params.route_meeting_id = this.routeMeetingId;
      let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      params.local_timezone = localTimeZone;
      params.schedule_id = this.scheduleId;
      params.poll_id = this.selectedPoll;
      params.question_id = this.questionId;
      params.export_type = "csv";
      params.token = this.userDetails.token;
      this.meetingReportsService.exportPollAnswers(params).subscribe(
        (res) => {
          FileSaver.saveAs(res, "Poll_answers.csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
          var fileURL = URL.createObjectURL(res);
        },
        (error) => {
        }
      )
    }
  }

  /**
   * Export poll answers pdf
   */
  exportPdf() {
    if(this.meetingId != '' && this.selectedPoll != '' && this.questionId != ''){
      let params:any = {};
      params.meeting_id = this.meetingId;
      // Added - 27/03/2018
      params.route_meeting_id = this.routeMeetingId;
      let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      params.local_timezone = localTimeZone;
      params.schedule_id = this.scheduleId;
      params.poll_id = this.selectedPoll;
      params.question_id = this.questionId;
      params.export_type = "pdf";
      params.token = this.userDetails.token;
      this.meetingReportsService.exportPollAnswers(params).subscribe(
        (res) => {
          FileSaver.saveAs(res, "Poll_answers.pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
          var fileURL = URL.createObjectURL(res);
        },
        (error) => {
        }
      )
    }
  }

  /**
   * Export poll consolidated report
   */
  exportConsolidated() {
    if(this.meetingId != '' && this.selectedPoll != ''){
      let params:any = {};
      params.meeting_id = this.meetingId;
      params.schedule_id = this.scheduleId;
      params.poll_id = this.selectedPoll;
      params.token = this.userDetails.token;
      this.meetingReportsService.exportConsolidated(params).subscribe(
        (res) => {
          FileSaver.saveAs(res, "Poll_answers.csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
          var fileURL = URL.createObjectURL(res);
        },
        (error) => {
        }
      )
    }
  }

}
