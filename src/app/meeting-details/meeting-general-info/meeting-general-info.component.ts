import { Component, OnInit, ViewChild } from '@angular/core';
import { Config } from 'app/config/config';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { NgForm } from '@angular/forms';
import { StaticService } from 'app/shared/staticdata';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { UserMeetingsListService } from 'app/user-meetings/user-meetings-list/user-meetings-list.service';
import { FacilitatorRequestsService } from 'app/admin/events-calendar/facilitator-requests/facilitator-requests.service';
import { DatePipe } from '@angular/common';
import _ from "lodash";
import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;
// declare var moment;
declare var Clipboard:any;


@Component({
  selector: 'app-meeting-general-info',
  templateUrl: './meeting-general-info.component.html',
  styleUrls: ['./meeting-general-info.component.css'],
  providers: [MeetingDetailsService, UserMeetingsListService, FacilitatorRequestsService, StaticService, DatePipe]
})

export class MeetingGeneralInfoComponent implements OnInit {

  @ViewChild('g') reinvite_form;

  public userDetails;
  public meetingId = '';
  public meeting:any = {};
  public reminderTypes = ["", "minutes", "hours", "days", "weeks"];
  public meetingStatus;
  public roleId;
  public urlPrefix = '';
  public allDataFetched:boolean = false;
  public keyword = '';
  public search = '';
  public facilitators:any;
  public facilitatorRecords:any = 0;
  public currentFacilitator:any;
  public facilitator_name:any = "";
  public assignType:any = "";
  public paid_amount:any = "";
  public user_not_paid:any = false;
  public disabled_paid_field:any = false;
  public savedFacilitatorPayment:any = false;
  public disableCancelBtn:boolean = false;
  public errorMsg:any   = "";
  public meetingRecordings = '';
  public isRescheduled:boolean = false;

  // Added - 16/04/2018
  public meetingTitle = "";
  public schedule_date;
  public timezone = "-05:00 US/Central";
  public timezoneErrorMsg  = "";
  public usZones:any = [];
  public intlZones:any = [];
  public invite_users = 0;
  public title = '';
  public dateError:boolean = false;
  public invitationContent = '';
  public invitationContentError = 0;
  public rejoinTimezone:any = "";
  public rejoinDate:any = "";
  public timeZones;
  public reScheduled:boolean = false;

  constructor(private datePipe :DatePipe, private staticService:StaticService, private user: User, private activatedRoute:ActivatedRoute, private meetingDetailsService: MeetingDetailsService, private router:Router, private toastrService: ToastrService, private userMeetingsListService: UserMeetingsListService, private facilitatorRequestsService: FacilitatorRequestsService) {
    this.userDetails   = user.getUser();
    this.timeZones     = this.staticService.getTimezones();
    this.usZones       = this.staticService.getUsZones();
    this.intlZones     = this.staticService.getIntlZones();
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
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    // this.getMeeting();
    this.getUserMeeting();
  }

  ngAfterViewInit(){
    $('#datetimepicker').datetimepicker({
      minDate: new Date(),
      sideBySide: true
    });

    $('#datetimepicker').on('dp.change', (e) => { 
      if(e.date._isValid){
        this.rejoinDate = e.date._d.toString();
        this.rejoinDate =  this.datePipe.transform(this.rejoinDate, 'MMM d, y, h:mm:ss a');
        // __this.dateError = false;
        this.dateError = false;
        this.changeSchedule();
      }else{
        // __this.dateError = true;
        this.dateError = true;
      } 
    })

  }

  /**
   * Show toastr error message
   * @param msg 
   */
  showError(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Show toastr success message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  /**
   * Copy link to clipboard
   * @param element 
   */
  copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr('data-copy-url')).select();
    document.execCommand("copy");
    $temp.remove();
    this.showSuccess('Copied');
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
            this.allDataFetched = true;
            let userMeetingDetails   = response.body.meeting;
            if(userMeetingDetails.meeting_status == 3){
              // Meeting completed
              this.meetingStatus = 1;
            }else{
              this.meetingStatus = 0;
            }
            this.processResponseData(response.body.meeting);
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            // this.router.navigateByUrl('/');
            this.redirectLogin();
          }else {
            if(this.roleId == '3'){
              // Registered user
              this.router.navigateByUrl('/meetings-list');
            }else {
              // Admin/Facilitator
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }
          }
        }
      );
    }
  }

  /**
   * Process meeting details
   * @param meetingInfo 
   */
  processResponseData(meetingInfo) {
    this.meeting.id = meetingInfo.meeting_id;
    this.meeting.title = meetingInfo.title;
    this.meeting.agenda = meetingInfo.agenda;
    this.meeting.durationHours = meetingInfo.duration_hours;
    this.meeting.durationMinutes = meetingInfo.duration_minutes;
    this.meeting.presentersUrl = meetingInfo.presenters_url;
    this.meeting.expertsUrl = meetingInfo.experts_url;
    this.meeting.attendeesUrl = meetingInfo.attendees_url;
    this.meeting.accessCode = meetingInfo.access_code;
    this.meeting.entryHours = meetingInfo.entry_hours;
    this.meeting.entryMinutes = meetingInfo.entry_minutes;
    this.meeting.reminders = meetingInfo.reminders;
    this.meeting.timezone = meetingInfo.timezone;
    this.meeting.schDate = meetingInfo.sch_date;
    this.meeting.schTime = meetingInfo.sch_time;
  }

  /**
   * Cancel meeting
   * @param meetingId 
   */
  cancelMeeting(meetingId) {
    this.disableCancelBtn = true;
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_id = meetingId;
    this.meetingDetailsService.cancelMeeting(params).subscribe(
      (response:any) => {
        this.disableCancelBtn = false;
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.showSuccess(response.message);
          $("#delete-pop").modal('hide');
          this.sendCancellation(params);
          if(this.roleId == '3'){
            // Registered user
            this.router.navigateByUrl('/meetings-list');
          }else if(this.roleId == '2'){
            // Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }else if(this.roleId == '1'){
            // Admin
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      },
      (error) => { 
        error = JSON.parse(error['_body']);
        this.showError($(error.message).text());
      }
    );
  }

  /**
   * Send cancellation email to invited users
   * @param params 
   */
  sendCancellation(params) {
    this.meetingDetailsService.sendCancellation(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
        }
      },
      (error) => { 
      }
    );
  }

  /**
   * Get meeting details
   */
  getUserMeeting(){
    if(this.meetingId != ''){
       let params:any = {};
       params.meeting_id = this.meetingId;
       params.token = this.userDetails.token;
       params.route_meeting_id = this.meetingId;
       this.userMeetingsListService.getUserMeeting(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.body.meeting){
            if(response.success == 1){
              this.allDataFetched = true;
              let meetingDetails   = response.body.meeting;
              if(meetingDetails.meeting_status == 3){
                // Meeting completed
                this.meetingStatus = 1;
              }else{
                this.meetingStatus = 0;
              }
              if(meetingDetails.is_rescheduled){
                if(meetingDetails.is_rescheduled == '1'){
                  this.isRescheduled = true;
                }
              }
              this.meeting         = response.body.meeting;
              if(this.meeting.is_user_paid == 0){ // user has not paid for facilitator
                this.user_not_paid        = true;
                this.paid_amount          = "";
                this.disabled_paid_field  =true;
              }else{                              // user has paid for facilitator
                this.user_not_paid        = false;
                this.disabled_paid_field  =false;
                this.paid_amount          = this.meeting.paid_for_facilitator;
              }
              this.processMeetingInfo(response.body.meeting);
            }
          }else{
            this.redirectHome();
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }else {
            if(this.roleId == '3'){
              // Registered user
              this.router.navigateByUrl('/meetings-list');
            }else {
              // Admin/Facilitator
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }
          }
        }
      );
    }
  }

  /**
   * Process meeting details
   * @param meetingDetails 
   */
  processMeetingInfo(meetingDetails)
  {
    let emailReminders = JSON.parse(meetingDetails['email_reminders']);
    let meetingDuration = this.hhmmss(meetingDetails['meeting_duration']);
    let durationHours = meetingDuration['hours'];
    let durationMinutes = meetingDuration['minutes'];
    this.meeting.duration_hours = durationHours;
    this.meeting.duration_minutes = durationMinutes;
    let entryDuration = this.hhmmss(meetingDetails['allotted_entry_duration']);
    let entryHours = entryDuration['hours'];
    let entryMinutes = entryDuration['minutes'];
    this.meeting.entry_hours = entryHours;
    this.meeting.entry_minutes = entryMinutes;
    let rems = _.orderBy(emailReminders, ['seconds'],['asc']); // Use Lodash to sort array by 'name'
    for(let i = 0; i < rems.length; i++){
      if(rems[i].type == "1"){
        rems[i].duration_type = "minutes";
      }else if(rems[i].type == "2"){
        rems[i].duration_type = "hours";
      }else if(rems[i].type == "3"){
        rems[i].duration_type = "days";
      }else if(rems[i].type == "4"){
        rems[i].duration_type = "weeks";
      }
    }
    this.meeting.reminders = rems;
    this.meeting.scheduled_date = moment(meetingDetails['meeting_date_time'], 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY [at] hh:mm a');
    this.meeting.meetingRecordings = Config.MEETING_RECORDINGS_URL+'?meetingId='+meetingDetails.m_id;
    if(meetingDetails['after_event_url'] != "0"){
      this.meeting.afterEventUrl = 'Recording - ' + moment.utc(meetingDetails['created_at']).local().format('MM/DD/YYYY hh:mm a');
    }else{
      this.meeting.afterEventUrl = 'Go To Main Room';
    }
  }

  pad(num) {
    return ("0"+num).slice(-2);
  }

  hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs%60;
    let hours = Math.floor(minutes/60)
    minutes = minutes%60;
    // return this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(secs);
    let response:any = {};
    response.minutes = minutes;
    response.hours = hours;
    response.seconds = secs;
    return response;
  }

  /**
   * Redirects to login page based on user role
   */
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

  /**
   * Redirects to home page based on user role
   */
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

  /**
   * Get faciitators list - For Admin
   * @param meetingId 
   * @param facilitatorId 
   * @param type 
   */
  getFacilitators(meetingId,facilitatorId,type){
    this.errorMsg            = "";
    this.keyword             = "";
    this.currentFacilitator  = facilitatorId;
    this.meetingId           = meetingId;
    this.assignType          = type;
    this.getFacilitatorsList();
  }

  /**
   * Get facilitators
   */
  getFacilitatorsList(){
    let params:any    =  {};
    params.limit      =  5;
    params.offset     =  1;
    params.token      =  this.userDetails.token;
    params.keyword    =  this.keyword;
    params.meetingId  =  this.meetingId;
    this.facilitatorRequestsService.getFacilitatorDetails(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.facilitators       = response.body.facilitator_details;
              this.currentFacilitator = response.body.current_facilitator;
              this.facilitatorRecords = this.facilitators.length;
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/admin/login');
                this.showError(error.message);
              }else{
                this.facilitators       = [];
                this.facilitatorRecords = this.facilitators.length;
              }
          }
    );     
  }

  selectedFacilitator(id: number) {
    $('input').not('#assign'+id).prop('checked', false);
    this.currentFacilitator =  id;
    this.facilitator_name   = $('#facilitator'+id).text();
    
  }

  clickedAction(){
  // this.currentFacilitator = "";
  }

  clickedRemove(id){
    this.meetingId =  id;
  }

  /**
   * Assign facilitator to a meeting
   * @param  
   * @param formInfo 
   */
  assignFacilitator($event,formInfo:NgForm){
    if(this.currentFacilitator != '0'){
        this.errorMsg         = "";
        let params:any        =  {};
        params.token          =  this.userDetails.token;
        params.facilitator_id =  this.currentFacilitator;
        params.meeting_id     =  this.meetingId;
        this.facilitatorRequestsService.assignFacilitator(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              $('#assign_facilitator').modal('hide');
              this.showSuccess('Facilitator assigned successfully');
              this.meeting.facilitator_name       = this.facilitator_name;
              this.meeting.paid_for_facilitator   = "";
              this.meeting.is_user_paid           = 0;
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/admin/login');
                this.showError(error.message);
              }
          }
        );
    }else{
      this.errorMsg = "Please choose a facilitator";
    }     
  }

  /**
   * Remove facilitator from a meeting
   */
  removeFacilitator(){
      let params:any        =  {};
      params.token          =  this.userDetails.token;
      params.facilitator_id =  "";
      params.meeting_id     =  this.meetingId;
      this.facilitatorRequestsService.removeFacilitator(params)
        .subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess('Facilitator removed successfully');
            $('#remove_facilitator').modal('hide');
            this.meeting.facilitator_name       = null;
            this.meeting.paid_for_facilitator   = "";
            this.meeting.is_user_paid           = 0;
          }
        },
        (error) => {
            error = JSON.parse(error['_body']);
            if(error.message == "Login failed"){
              this.user.logOut();
              this.router.navigateByUrl('/admin/login');
              this.showError(error.message);
            }
        }
      );
  }

  /**
   * Save facilitator payment details
   * @param meetingId 
   */
  saveFacilitatorPayment(meetingId){
      let params:any        =  {};
      params.token          =  this.userDetails.token;
      params.facilitator_id =  "";
      params.meeting_id     =  meetingId;
      params.user_not_paid  =  this.user_not_paid;
      params.paid_amount    =  this.paid_amount;
      this.facilitatorRequestsService.saveFacilitatorPayment(params)
        .subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess('Facilitator payment added successfully');
            $('#PaidForFacilitator').modal('hide');
            this.savedFacilitatorPayment      = true;
            this.meeting.paid_for_facilitator = this.paid_amount;
            if(this.user_not_paid == false){
              this.meeting.is_user_paid       = 1;
            }else{
              this.meeting.is_user_paid       = 0;
            }
          }
        },
        (error) => {
            error = JSON.parse(error['_body']);
            if(error.message == "Login failed"){
              this.user.logOut();
              this.router.navigateByUrl('/admin/login');
              this.showError(error.message);
            }
        }
      );
  }

  clickedUserNotPaid(){
    if(this.user_not_paid){
      this.paid_amount          = this.meeting.paid_for_facilitator;
      this.disabled_paid_field  = false;
    }else{
      this.paid_amount = "";
      this.disabled_paid_field = true;
    }
  }

  OpenedPaidFacilitatorModal(){
      if(this.meeting.is_user_paid == 0){
        this.user_not_paid        = true;
        this.paid_amount          = this.meeting.paid_for_facilitator;
        this.disabled_paid_field  = true;
      }else{
        this.user_not_paid        = false;
        this.disabled_paid_field  = false;
        this.paid_amount          = this.meeting.paid_for_facilitator;
      }
  }

  formatTimezone(timezone) {
    if(timezone){
      let tz = timezone.split(" ");
      if ( tz[1] !== void 0 ) {
        return moment().tz(tz[1]).zoneAbbr(); 
      }else{
        return false;
      }
    }
  }

  // Added - 16/04/2018
  /**
   * Reinvite / Reschedule meeting
   * @param event 
   * @param invitation 
   * @date 2018-03-12
   */
  reInvite(event, invitation:NgForm) {
    let errors = 0;
    if(!invitation.form.controls.schedule_date.valid){
      this.dateError = true;
      errors++;
    }else{
      this.dateError = false;
    }
    if(this.timezone == ""){
      this.timezoneErrorMsg   = 'Please select timezone';
      errors++;
    }
    if(this.invite_users == 1){
      if(this.invitationContent != ''){
        this.invitationContentError = 0;
      }else{
        errors++;
        this.invitationContentError = 1;
      }
    }
    if(this.title == ""){
      errors++;
    }
    if(errors > 0){
    }else{
      let formData:FormData = new FormData();
      let params:any = {};
      params.token            = this.userDetails.token;
      params.meeting_id       = this.meetingId;
      params.meeting_title    = this.title;
      params.meeting_role_id  = this.roleId;
      params.invitation_content = invitation.value.invitationContent;
      params.scheduled_date   = this.schedule_date;
      params.timezone         = this.timezone;
      if(this.invite_users){
        params.invite_users   = 1;
      }else{
        params.invite_users   = 2;
      }
      this.userMeetingsListService.reInvite(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            $('#meetingRejoin').modal('hide');
            // Redirects to general info page
            // Commented - 16/04/2018
            // this.router.navigateByUrl(this.urlPrefix + '/meetings/general-info/' + this.meetingId);
            // Added - 16/04/2018
            this.reScheduled = true;
            invitation.resetForm();
            // Added - 16/04/2018
            this.getUserMeeting();

            // Commented - redirects to general info page
            // Load future meetings
            // this.getUserEvents();
            // Load past meetings
            // this.getUserPastEvents();
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          this.showFailure(error.message);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }else{
            this.redirectHome();
          }
        }
      );
    }
  }

  /**
   * Show error toastr message
   * @param msg 
   */
  showFailure(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Show reschedule modal
   * @param meeting_id 
   */
  meetingReJoin(){
    this.dateError              = false;
    this.timezoneErrorMsg       = "";
    this.invitationContentError = 0;
    // this.reinvite_form.resetForm();
    // $('#datetimepicker').val("").datetimepicker("update");
    // $('#datetimepicker').datetimepicker().reset();
    this.schedule_date = '';
    $('#meetingRejoin').modal('show');
    this.timezone       = this.meeting.timezone;
    this.meetingTitle   = this.meeting.meeting_title;
    this.title = this.meeting.meeting_title
    this.rejoinTimezone = this.formatTimezone(this.timezone);
  }

  changeTimezone(value){
    if(value != ""){
      this.timezoneErrorMsg = "";
      this.rejoinTimezone   = this.formatTimezone(value);
      this.changeSchedule();
    }
  }

  /**
   * Change notification message while reschedule
   */
  changeSchedule(){
    this.invitationContent      = 'You are cordially invited to join the meeting  '+this.meetingTitle+' on '+this.rejoinDate+' '+this.rejoinTimezone+'.';
  }
  
}
