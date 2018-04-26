import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { MeetingReportsService } from 'app/meeting-details/meeting-reports/meeting-reports.service';
import { QuestionsAnswersService } from 'app/meeting-details/questions-answers/questions-answers.service';
import { StaticService } from 'app/shared/staticdata';
import { DatePipe,UpperCasePipe } from '@angular/common';
import { MESSAGE } from "app/shared/message";
import { Config } from 'app/config/config';
import * as moment from 'moment';
import 'moment-timezone';
import { Subscription } from 'rxjs';

declare var $:any;

@Component({
  selector: 'app-questions-answers',
  templateUrl: './questions-answers.component.html',
  styleUrls: ['./questions-answers.component.css'],
  providers :[MeetingDetailsService,StaticService,DatePipe, MeetingReportsService, QuestionsAnswersService]
})

export class QuestionsAnswersComponent implements OnInit {

  @Input() routeMeetingId;
  @Input() meetingId;
  @Input() isAccessEnabled;
  @Output() filterTypeChanged = new EventEmitter();

  private _scheduleId: string;
  @Input() set scheduleId(value: string) {
   this._scheduleId = value;
   this.getMeeting();
  }
  get scheduleId(): string {
      return this._scheduleId;
  }

  public meetingStatus;
  public userDetails;
  //public meetingId = '';
  public meeting:any = {};
  public questionAnswers:any = [];
  public filterType:any = 1;
  public openQuestionsData:any;
  public closedQuestionsData:any;
  public searchData:any;
  public qestionsDetails:any = [];
  public searchText = "All Questions";
  public paginateDetails:any [];
  public allQuestions:any = [];
  public recordsTotal:any;
  public limitedRecords:any = [];
  // Added - 17/11/2017
  public roleId;
  public urlPrefix = '';
  //public routeMeetingId;

  public allDataFetched:boolean = false;
  public accessDenied:boolean = false;
  public accessMessage = '';
  public mId;
  public questionsFetched:boolean = false;
  p: number = 1;
  attendanceBusy: Subscription;
  // Added - 16/04/2018
  questionsBusy: Subscription;
  public qestionsOffset:number = 0;
  constructor(private user: User, private activatedRoute:ActivatedRoute, private meetingDetailsService: MeetingDetailsService, private router:Router, private toastrService: ToastrService,private staticService:StaticService, private meetingReportsService:MeetingReportsService, private questionsAnswersService: QuestionsAnswersService) { 
    this.userDetails          = user.getUser();
    // Added - 17/11/2017
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {

    // this.activatedRoute.params.subscribe((params: Params) => {
    //   this.meetingId   = params['meetingId'];
    //   // Added - 17/11/2017
    //   this.routeMeetingId = params['meetingId'];
    // });
    // this.questionAnswers      = this.staticService.getQuestionsAnswers();
    // this.qestionsDetails      = this.questionAnswers;
    // console.log(this.questionAnswers)
    
    // Commented - 19/03/2018
    // this.getMeeting();

  }

  pageChanged(event) {
    
    this.questionAnswers  = [];
    this.qestionsOffset   = event;
    this.p                = event;
    this.paginateOpenClosedQuestions();
   
    
  }

 
  toggleDropdownClick(id){
    $("#toogle-dropdown"+id).find("img").toggleClass("clickIconRotate");
    $("#toogle-dropdown"+id).parent().parent().next(".questions-answe-ul").slideToggle();
  }

   /**
   * Get meeting details
   */
  getMeeting(){
    if(this.meetingId != ''){
       let meetingParams:any = {};
       meetingParams.meeting_id = this.meetingId;
       meetingParams.token = this.userDetails.token;
       this.meetingDetailsService.getMeeting(meetingParams).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            let meetingDetails   = response.body.meeting;
            if(meetingDetails.meeting_status == 3){
              // Meeting completed
              this.meetingStatus = 1;
            }else{
              this.meetingStatus = 0;
            }
            this.mId = meetingDetails.m_id;
            this.processResponseData(response.body.meeting);
            this.checkAccess();
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            // this.router.navigateByUrl('/');
            // Added - 17/11/2017
            this.redirectLogin();
          }
        }
      );
    }
  }

  processResponseData(data){

  }

  getfilter(filter_type){ 
    this.p                   = 1;
    this.qestionsOffset      = 1;
    this.openQuestionsData   = [];
    this.closedQuestionsData = [];
    this.searchData          = [];
    this.questionAnswers     = [];
    this.paginateDetails     = [];
    this.filterType          = filter_type;
    this.filterTypeChanged.emit(this.filterType);
    let  allQuestions        = this.qestionsDetails;
    for(let i = 0; i<allQuestions.length; i++){
      let question:any = {};
      //console.log(allQuestions[i])
      question.id = allQuestions[i].id;
      question.us_name = allQuestions[i].senderName;
      question.email   = allQuestions[i].email;
      question.us_image = Config.UPLOAD_PATH + 'default/default.jpg';
      question.question = allQuestions[i].question;
      let time  = moment(allQuestions[i].time).format("MM/DD/YYYY HH:mm:ss");
      let dateTime:any;
      dateTime  = new Date(time);
      dateTime  = moment(dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
      question.created_at = dateTime;
      let answers:any = [];
      if(allQuestions[i].answer){
        let qAnswer = allQuestions[i].answer;
        let answer:any = {};
        answer.us_name = qAnswer.anweredby;
        answer.us_image = Config.UPLOAD_PATH + 'default/default.jpg';
        answer.answer   = qAnswer.answer;
        answer.email    = qAnswer.email;
        let time  = moment(allQuestions[i].time).format("MM/DD/YYYY HH:mm:ss");
        let dateTime:any;
        // Commented - 20/03/2018
        // dateTime  = new Date(time+' UTC');
        dateTime = new Date(time);
        dateTime  = moment(dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
        answer.created_at = dateTime;
        answers.push(answer);
      }
      question.answers = answers;
      this.paginateDetails.push(question);
    }
    
    if(this.paginateDetails){
      this.paginateDetails.forEach(item => {  
          if(item.answers.length <= 0){
            this.openQuestionsData.push(item);
          }else{
            this.closedQuestionsData.push(item);
          }
      });
    }
     
    if(this.filterType == 1){
      this.searchData = this.paginateDetails;
      this.searchText = "All Questions";
    }else if(this.filterType == 2){
      this.searchText = "Open Questions";
      this.searchData = this.openQuestionsData;
    }else{
      this.searchText = "Answered Questions";
      this.searchData = this.closedQuestionsData;
    }
    this.paginateOpenClosedQuestions();
    
  }


  paginateOpenClosedQuestions(){
    let allQuestions:any  = [];
    allQuestions          = this.searchData;
    let limit             = 10;
    this.questionAnswers  = [];
    let newOffset:number  = (this.qestionsOffset-1)*10;
    if(allQuestions.length >= newOffset+10){
        limit = this.qestionsOffset*10;
    }else{
        limit = allQuestions.length;
    }
    
    for(let i = newOffset; i<limit; i++){
         this.questionAnswers.push(allQuestions[i]);
    }
    this.recordsTotal   = this.searchData.length;
    /*console.log(limit)
    console.log(allQuestions.length)
    console.log(this.qestionsOffset)
    console.log(newOffset)
    console.log(this.questionAnswers)*/
  }


  // Added - 16/11/2017
  redirectLogin()
  {
    if(this.roleId == '1') {
      // Admin
      this.router.navigateByUrl('/admin/login');
    }else{
      // Facilitator/Registered user
      this.router.navigateByUrl('/');
    }
  }

  redirectHome()
  {
    if(this.roleId == '3'){
      // Registered user
      this.router.navigateByUrl('/meetings-list');
    }else{
      // Admin/Facilitator
      this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
    }
  }

  checkAccess()
  {
    let params:any = {};
    params.token   = this.userDetails.token;
    params.route_meeting_id = this.routeMeetingId;
    this.meetingReportsService.checkQaAccess(params).subscribe(
        (response:any) => {
          this.allDataFetched = true;
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            // this.questionAnswers      = this.staticService.getQuestionsAnswers();
            // this.qestionsDetails      = this.questionAnswers;
            
            this.getAllQuesions();
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }else if(error.hasOwnProperty('status')) {
            if(error.status == 'access_denied'){
              this.accessDenied = true;
              this.accessMessage = MESSAGE.ACCESS_PERMISSION_DENIED;
            }
          }else{
            this.redirectHome();
          }
        }
    );
  }

  getAllQuesions()
  {
    this.limitedRecords     = [];
    if(this.mId != ''){
      this.questionAnswers  = [];
      let params:any        = {};
      params.meetingId      = this.mId;
      params.scheduleId     = this.scheduleId;
      // Changed - 16/04/2018
      // Added busy param
      this.questionsBusy = this.questionsAnswersService.getAllQuestions(params).subscribe(
        (response:any) => {

          // Added - 26/03/2018
          this.openQuestionsData = [];
          this.closedQuestionsData = [];

          this.questionsFetched = true;
          response              = JSON.parse(response['_body']);
          if(response['questions']){
            // Group Comment - 26/03/2018
            // this.p              = this.qestionsOffset;
            // // Commented - 19/03/2018
            // // this.recordsTotal   = response.totalQ;
            // let allQuestions    = response['questions'];
            // this.allQuestions   = allQuestions;
            // // Commented - 19/03/2018
            // // this.qestionsDetails = this.allQuestions;
            
            // // Added - 19/03/2018
            // // Filter details according to the scheduled dates
            // // console.log(this.scheduleId);
            // let totalRecords = 0;
            // for(let i=0; i<this.allQuestions.length; i++){
            //   // this.allQuestions[i].schedule_id = this.scheduleId; // Remove this line after integrating
            //   if(this.allQuestions[i].scheduleId){
            //     if(this.allQuestions[i].scheduleId == this.scheduleId){
            //       this.qestionsDetails.push(this.allQuestions[i]);
            //       totalRecords ++;
            //     }
            //   }
            // }
            // this.recordsTotal = totalRecords;
            // Group comments ends - 26/03/2018


            // Added - 26/03/2018
            this.p              = this.qestionsOffset;
            this.recordsTotal   = response.totalQ;
            let allQuestions    = response['questions'];
            this.allQuestions   = allQuestions;
            this.qestionsDetails= this.allQuestions;


            this.getfilter(this.filterType);
            /*let allQuestions    = response['questions'];
            let limit           = 10;
            this.allQuestions   = allQuestions;
            if(allQuestions.length > this.qestionsOffset+10){
                limit = 10;
            }else{
                limit = allQuestions.length;
            }
            for(let i = this.qestionsOffset; i<limit; i++){
              let question:any = {};
              question.id = allQuestions[i].id;
              question.us_name = allQuestions[i].senderName;
              question.email   = allQuestions[i].email;
              question.us_image = Config.UPLOAD_PATH + 'default/default.jpg';
              question.question = allQuestions[i].question;
              let time  = moment(allQuestions[i].time).format("MM/DD/YYYY HH:mm:ss");
              let dateTime:any;
              dateTime  = new Date(time+' UTC');
              dateTime  = moment(dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
              question.created_at = dateTime;
              let answers:any = [];
              if(allQuestions[i].answer){
                let qAnswer = allQuestions[i].answer;
                let answer:any = {};
                answer.us_name = qAnswer.anweredby;
                answer.us_image = Config.UPLOAD_PATH + 'default/default.jpg';
                answer.answer   = qAnswer.answer;
                answer.email    = qAnswer.email;
                let time  = moment(allQuestions[i].time).format("MM/DD/YYYY HH:mm:ss");
                let dateTime:any;
                dateTime  = new Date(time+' UTC');
                dateTime  = moment(dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
                answer.created_at = dateTime;
                answers.push(answer);
              }
              question.answers = answers;
              this.limitedRecords.push(question);
            }
            console.log('got')
            this.questionAnswers      = this.limitedRecords;
            this.qestionsDetails      = this.allQuestions; */
          }
        },
        (error) => {
        }
      )
    }
  }

}
