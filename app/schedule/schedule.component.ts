import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ScheduleService } from 'app/schedule/schedule.service';
import { StaticService } from 'app/shared/staticdata';
import { MeetinginfoComponent } from 'app/meetinginfo/meetinginfo.component';
import { User } from "app/shared/user";
import { CategoryService } from 'app/category/category.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MeetingService } from 'app/meeting/meeting.service';
import { HostListener } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;
declare var Clipboard:any;
declare var tinymce: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [ScheduleService, StaticService, CategoryService, MeetingService]
})


export class ScheduleComponent implements OnInit {

  public roleId;
  public urlPrefix = '';

  @HostListener('window:beforeunload', ['$event'])
  public doSomething($event) {
      // console.log("do I see this?")
  }
  @ViewChild('cloneDiv') cloneDiv:ElementRef;
  public timeZones;
  public remindersArray :any         = [];
  public items: any = [];
  public duration_hours = '1'; // Default 1 hour
  entry_hours;
  categories;
  agenda = '';
  notify_changes = false;
  public schedule_date;
  schedule_time; 
  title;
  allow_facilitator;
  public userDetails;
  public meeting: any   = [];
  public params: any = [];
  public categoryInfo: any = {};
  meetingId = '';
  public duration_minutes = "00";
  public entry_minutes = "00";
  public meetingDetails:any = {};
  public timezone = "-05:00 US/Central";
  public disableSubmit:boolean = false;
  public dateError:boolean = false;
  public remindersError:boolean = false;
  public durationHoursError:boolean = false;
  public durationMinutesError:boolean = false;
  public loaderClass = '';
  public usZones:any = [];
  public intlZones:any = [];
  public disableEdit:boolean = false;
  public afterEventUrls:any = [{"value":0,"label": "Go To Main Room"}];
  public recordingsUrls:any = [];
  public after_event_url = 0;
  public meetingStatus = 0; // Future meetings
  public allDataFetched:boolean = false;
  public is_sprout = false;

  constructor(
    private scheduleService:ScheduleService,
    private staticService:StaticService,
    private user:User,
    private categoryService:CategoryService,
    private router:Router, private activatedRoute:ActivatedRoute,
    private meetingService:MeetingService,
    private toastrService: ToastrService
  ) { 
    this.timeZones     = this.staticService.getTimezones();
    this.usZones       = this.staticService.getUsZones();
    this.intlZones     = this.staticService.getIntlZones();
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      this.urlPrefix = '/facilitator';
    }
    this.getCategories();
  }

  ngOnInit() {
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    this.initremindersArray();
    $('.modal-backdrop').remove();
    $('#datetimepicker').datetimepicker({
      minDate: new Date(),
      sideBySide: true
    });
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['meetingId']){
        this.meetingId   = params['meetingId'];
        this.meetingDetails = this.getMeetingDetails(this.meetingId);
      }
    });

    $(document).ready(function() {
      $('button').tooltip({
        trigger: 'click',
        placement: 'bottom'
      });
      
      function setTooltip(btn, message) {
        $(btn).tooltip('hide')
          .attr('data-original-title', message)
          .tooltip('show');
      }
      
      function hideTooltip(btn) {
        setTimeout(function() {
          $(btn).tooltip('hide');
        }, 1000);
      }
      // Clipboard
      var clipboard = new Clipboard('button');
      clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
        e.clearSelection();
      });
      clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
      });
    });
    $('#datetimepicker').on('dp.change', (e) => { 
      if(e.date._isValid){
        this.dateError = false;
      }else{
        this.dateError = true;
      } 
    })

    this.checkDuration();
  }

  loadScript() {
      $('#datetimepicker').datetimepicker({ });
  }   


  ngAfterViewInit() {
    $('#datetimepicker').datetimepicker({
      minDate: new Date(),
      sideBySide: true
    });

    $('#datetimepicker').on('dp.change', (e) => { 
      if(e.date._isValid){
        this.dateError = false;
      }else{
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
   * Copy link
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
   * Schedule meeting - Save or Update meeting
   */
  scheduleMeeting(event, meetingInfo:NgForm){
    if(meetingInfo.valid && !this.durationHoursError){
      this.dateError = false;
      this.disableSubmit = true;
      this.loaderClass = 'schedule-overlay';
      meetingInfo.value.reminders   = this.remindersArray;
      meetingInfo.value.token       = this.userDetails.token;
      meetingInfo.value.meeting_id = this.meetingId;
      this.scheduleService.createMeeting(meetingInfo).subscribe(
        (response:any) => {
          this.disableSubmit = false;
          this.loaderClass = '';
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.meeting   = response.body.meeting;
            if(this.meetingId != ''){
              // Update
              this.router.navigateByUrl(this.urlPrefix + '/meetings/general-info/'+this.meetingId);
            }else{
              $("#meetingSched").modal({'show': true, 'backdrop': 'static'});
              meetingInfo.resetForm();
              // Invite host
              let params:any = {};
              params.meeting_id = this.meeting.id;
              params.token = this.userDetails.token;
              this.inviteHost(params);
            }
          }else{
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            // this.socialLoginComponent.logout();
            this.user.logOut();
            // this.router.navigateByUrl('/');
            this.redirectLogin();
          }else{
            // Errors
            this.disableSubmit = false;
            this.loaderClass = '';
            this.showError(error.message);
          }
        }
      );
    }else{
      if(!meetingInfo.form.controls.schedule_date.valid){
        // console.log('error in date');
        this.dateError = true;
      }else{
        this.dateError = false;
      }
    }
    // this.showConfirm();
  }

  /**
   * Reminders Array - Default - 1
   */
  initremindersArray(){
    for(let i=0; i<this.remindersArray.length; i++) {
    }
    if(this.remindersArray.length == 0) {
      let obj:any         = {};
      obj.duration        = "",
      obj.duration_type   = "",
      obj.dur_error       = false;
      obj.type_error      = false;
      obj.dur_req         = "";
      obj.type_req        = "";
      this.remindersArray.push(obj);
    }
  }

  /**
   * Add reminder to array
   */
  addReminder(){
    if(this.remindersArray.length < 5){
      let obj:any   = {};
      obj.duration        = "",
      obj.duration_type   = "",
      obj.dur_error       = false;
      obj.type_error      = false;
      obj.dur_req         = "";
      obj.type_req        = "";
      this.remindersArray.push(obj);
    }
  }

  /**
   * Remove reminder from array
   * @param index 
   */
  removeReminder(index){
    this.remindersArray.splice(index, 1);
  }

  showModal()
  {
  }

  /**
   * Get all categories - For tag input
   */
  getCategories()
  {
    this.categoryInfo.token   = this.userDetails.token;
    this.categoryService.getCategories(this.categoryInfo).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            let categories_array = response.body.categories;
            for(let category of categories_array){
              this.items.push(category['category_name']);
            }
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            // this.socialLoginComponent.logout();
            this.user.logOut();
            // this.router.navigateByUrl('/');
            this.redirectLogin();
          }
        }
      );
  }

  /**
   * Get meeting details - Edit meeting
   * @param id 
   */
  getMeetingDetails(id) {
    let meetingParams:any = {};
    meetingParams.token = this.userDetails.token;
    meetingParams.meeting_id = id;
    this.meetingService.getMeeting(meetingParams).subscribe(
      (response) => {
        this.procesResponseData(response)
        this.allDataFetched = true;
        this.checkDuration();
      },
      (error) => this.procesErrorData(error)
    )
  }

  /**
   * Process meeting details - Edit meeting
   * @param response 
   */
  procesResponseData(response) {
    response = JSON.parse(response['_body']);
    if (response.success == 1) {
      let result = response.body.meeting;
      this.title = result.title;
      this.agenda = result.agenda;
      this.timezone = result.timezone;
      this.duration_hours = result.duration_hours;
      if(result.meeting_status == "3"){ // Past meeting
        this.disableEdit = true;
        this.meetingStatus = 1; // Future meetings
        // tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
      }

      // Added - 16/04/2018
      if(result.is_rescheduled == 1){
        this.disableEdit =  true;
      }

      if(result.duration_minutes > 0){
        this.duration_minutes = result.duration_minutes;
      }else{
        this.duration_minutes = "00";
      }
      this.entry_hours = result.entry_hours;
      if(result.entry_minutes > 0){
        this.entry_minutes = result.entry_minutes;
      }else{
        this.entry_minutes = "00";
      }
      if(this.duration_minutes != "00"){
        this.durationHoursError = false;
      }
      this.categories = result.categories;
      this.schedule_date = result.schedule_date;
      if(result.allow_facilitator == 1){
        this.allow_facilitator = true;  
      }else{
        this.allow_facilitator = false;
      }
      this.remindersArray = result.reminders;
      if(this.remindersArray.length == 0){
        this.initremindersArray();
      }
      if(result.meeting_status != "3"){
        // $('#datetimepicker').data("DateTimePicker").minDate(this.schedule_date);
        $('#datetimepicker').data("DateTimePicker").minDate(new Date());
        $('#datetimepicker').data("DateTimePicker").date(this.schedule_date);
      }
      this.after_event_url = result.after_event_url;
      // Added - 28/03/2018 - Sprout meeting
      if(result.is_sprout == 1){
        this.is_sprout = true;
      }else{
        this.is_sprout = false;
      }
      let recordings = result.recordings;
      for(let i=0; i<recordings.length; i++){
        let rec:any = {};
        rec.value = recordings[i].id;
        let localTime = '';
        if(recordings[i].created_at){
          localTime = moment.utc(recordings[i].created_at).local().format('MM/DD/YYYY hh:mm a');
        }else{
          localTime = moment().format('MM/DD/YYYY hh:mm a');
        }
        rec.label = localTime;
        this.recordingsUrls.push(rec);
      }
    }
  }

  /**
   * Process error response
   * @param response 
   */
  procesErrorData(response) {
      response      = JSON.parse(response['_body']);
      if(response.message == 'Login failed'){
        // this.socialLoginComponent.logout();
        this.user.logOut();
        // this.router.navigateByUrl('/');
        this.redirectLogin();
      }
  }

  /**
   * Show confirmation modal while cancel facilitator request
   * @param event 
   */
  confirmFacilitator(event) {
    if(this.meetingId != ''){
      if(event.target.checked == false){
        $("#facilitator-pop").modal({'show': true});
      }
    }
  }

  /**
   * Cancel facilitator request
   * @param param 
   */
  cancelFacilitator(param) {
    if(param == true){
      // this.allow_facilitator = 0;
      this.allow_facilitator = false;
    }else{
      // this.allow_facilitator = 1;
      this.allow_facilitator = true;
    }
    $("#facilitator-pop").modal('hide');
  }

  /**
   * Check reminders - Type and duration
   * @param remRow 
   */
  checkRequired(remRow){
    for(let i=0; i<this.remindersArray.length; i++) {
      if(i==remRow){
        if(this.remindersArray[i].duration_type !="" || this.remindersArray[i].duration !=""){
          return true;
        }else{
          return false;
        }
      }
    }
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
   * Get timezone abbreviation
   * @param timezone 
   */
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

  checkReminders(){
    for(let i=0; i<this.remindersArray.length; i++) {
    }
  }

  /**
   * Check meeting duration - hours and minutes
   */
  checkDuration()
  {
    if(this.duration_minutes === "00"){
      if(!this.duration_hours || this.duration_hours == '' || parseInt(this.duration_hours) < 1 || parseInt(this.duration_hours) > 23){
        this.durationHoursError = true;
      }else{
        this.durationHoursError = false;
      }
    }else{
      this.durationHoursError = false;
    }
  }

  /**
   * Invite host while schedule meeting
   */
  inviteHost(params) {
    this.scheduleService.inviteHost(params).subscribe(
      (response) => {
      },
      (error) => {
      }
    )
  }

  /**
   * Save after event url
   */
  saveAfterEventUrl() {
    if(this.meetingId != '' && this.disableEdit){
      let params:any = {};
      params.meeting_id = this.meetingId;
      params.after_event_url = this.after_event_url;
      this.scheduleService.saveAfterEventUrl(params).subscribe(
        (response) => {
          this.router.navigateByUrl(this.urlPrefix + '/meetings/general-info/'+this.meetingId);
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }else{
            this.redirectHome();
          }
        }
      )
    }
  }

  /**
   * Update past meeting
   * @param event 
   * @param meetingInfo 
   */
  updatePastMeeting(event, meetingInfo:NgForm){
    if(meetingInfo.valid && this.disableEdit){
      this.disableSubmit = true;
      meetingInfo.value.token = this.userDetails.token;
      meetingInfo.value.meeting_id = this.meetingId;
      this.scheduleService.updatePastMeeting(meetingInfo).subscribe(
        (response:any) => {
          this.disableSubmit = false;
          response   = JSON.parse(response['_body']);
          this.router.navigateByUrl(this.urlPrefix + '/meetings/general-info/'+this.meetingId);
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }else{
            this.redirectHome();
          }
        }
      )
    }
  }
  
}
