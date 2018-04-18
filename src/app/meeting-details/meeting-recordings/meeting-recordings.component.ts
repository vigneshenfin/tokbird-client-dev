import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { MeetingRecordingsService } from 'app/meeting-details/meeting-recordings/meeting-recordings.service';
import { Config } from 'app/config/config';
import { ToastrService } from 'toastr-ng2';
import { MESSAGE } from "app/shared/message";
import * as moment from 'moment';
import 'moment-timezone';
import _ from "lodash";

declare var $:any;

@Component({
  selector: 'app-meeting-recordings',
  templateUrl: './meeting-recordings.component.html',
  styleUrls: ['./meeting-recordings.component.css'],
  providers: [MeetingDetailsService, MeetingRecordingsService]
})

export class MeetingRecordingsComponent implements OnInit {

  public userDetails;
  public meetingId = '';
  public meetingStatus;
  public recordings:any = [];
  public recordingsPath = '';
  public recordingsUrl = '';
  public recToDelete = '';
  public allDataFetched = false;
  public recordingsGroup:any = [];
  public videoUrl = '';
  public videoTitle = '';
  public videoTag = '';
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public accessDenied:boolean = false;
  public accessMessage = '';
  public invitedUser = '';
  public conferenceUrl = '';
  public recLink = '';
  public isRescheduled:boolean = false;
  public schedules:any = [];
  public scheduleId = '';
  public allRecordings:any = [];

  constructor(private user: User, private activatedRoute:ActivatedRoute, private router:Router, private meetingDetailsService: MeetingDetailsService, private meetingRecordingsService:MeetingRecordingsService, private toastrService: ToastrService) {
    this.userDetails   = user.getUser(); 
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
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    this.recordingsPath = Config.RECORDINGS_PATH;
    this.recordingsUrl = Config.RECORDINGS_URL;
    this.conferenceUrl = Config.CONFERENCE_URL;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
      this.routeMeetingId = params['meetingId'];
    });
    this.getMeetingStatus();
  }

  ngOnDestroy() {
    $(".modal").modal('hide');
  }

  /**
   * Get status of a meeting - past or future
   * 
   * @author
   * @date 2017-10-26
   */
  getMeetingStatus() {
    let params:any = {};
    params.meeting_id   = this.meetingId;
    params.token   = this.userDetails.token;
    this.meetingDetailsService.getStatus(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          let meeting   = response.body.meeting;
          if(meeting.is_rescheduled){
            if(meeting.is_rescheduled == 1){
              this.isRescheduled = true;
            }
          }
          if(meeting.meeting_status == 3){
            this.meetingStatus = 1;
            this.getRecordings(params);
          }else if(this.isRescheduled){
            this.meetingStatus = 0;
            this.getRecordings(params);
          }else{
            this.redirectHome();
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
        }else{
          this.redirectHome();
        }
      }
    )
  }

  /**
   * Get recordings
   * 
   * @param params 
   * @date 2017-10-30
   */
  getRecordings(params) {
    params.route_meeting_id = this.routeMeetingId;
    this.meetingRecordingsService.recordings(params).subscribe(
      (response:any) => {
        this.allDataFetched = true;
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.recordings = response.body.recordings;
          this.invitedUser = response.body.invited_user;
          // this.schedules = response.body.schedules;
          this.allRecordings = response.body.recordings;
          this.processSchedules(response.body.schedules);
          // this.groupRecordings();
          this.filterRecordings();
        }else{
          this.router.navigateByUrl('/meetings-list');
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.redirectLogin();
        }else{
          if (error.hasOwnProperty('status')) {
            if(error.status == 'access_denied'){
              this.accessDenied = true;
              this.accessMessage = MESSAGE.ACCESS_PERMISSION_DENIED;
            }
          }else{
            this.redirectHome();
          }
        }
      }
    )
  }

  /**
   * Group recordings(three in each group)
   */
  groupRecordings() {
    for(let m=0; m<this.recordings.length; m++) {
      let localTime = moment.utc(this.recordings[m].created_at).local().format('DD MMM. YYYY, hh:mm a');
      this.recordings[m].recTime = localTime;
      this.recordings[m].recNumber = (m+1);
    }
    this.recordingsGroup = [];
    for(let i = 0; i < this.recordings.length; i = i + 3) {
      let group = this.recordings.slice(i, i + 3);
      this.recordingsGroup.push(group);
    }
  }

  /**
   * Show delete confirmation modal
   * @param recId 
   */
  confirmDeleteRecording(recId) {
    if(recId != ''){
      this.recToDelete = recId;
      $("#delete-pop-recordings").modal({'show':true});
    }
  }

  /**
   * Delete recording
   * 
   * @param recId 
   */
  deleteRecording(recId) {
    if(recId != ''){
      let params:any = {};
      params.meeting_id = this.meetingId;
      params.recording_id = recId;
      params.token = this.userDetails.token;
      params.route_meeting_id = this.routeMeetingId;
      this.meetingRecordingsService.deletRecording(params).subscribe(
        (response:any) => {
          $("#delete-pop-recordings").modal('hide');
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            for(let i=0; i<this.recordings.length; i++){
              if(this.recordings[i].id == recId){
                this.recordings.splice(i, 1);
              }
            }
            this.groupRecordings();
            this.showSuccess(response.message);
          }else{
            this.redirectHome();
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }else{
            this.redirectHome();
          }
        }
      )
    }
  }

  /**
   * Play meeting recording
   * @param recId 
   */
  playRecording(recId) {
    if(recId!=''){
      for(let i=0; i<this.recordings.length; i++){
        if(this.recordings[i].id == recId){
          let videoDate = this.formatDateTime(this.recordings[i].scheduled_date) + ' ' + this.formatTimezone(this.recordings[i].timezone);
          this.videoUrl = this.recordingsUrl + '?meetingId='+ this.recordings[i].m_id +'&userId='+ this.invitedUser +'&id=' + this.recordings[i].video_id + '&title=' + this.recordings[i].meeting_title + '&date=' + videoDate + '&role=4'; // Host - no need to see polls
          this.videoTitle = this.recordings[i].meeting_title + ' - ' + this.recordings[i].recNumber;
          $("#vid_play").modal({'show':true, 'backdrop': 'static'});
          $("#video").html('<iframe class="popup-video" id="rec-video" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen src="'+this.videoUrl+'" width="100%" height="480" style="border: none!important;" />');
          $('#rec-video').height($(window).height() - 103);
          // Update on demand video join time
          let params:any = {};
          params.meeting_id = this.meetingId;
          this.updateRecordingTime(params);
        }
      }
    }
  }

  /**
   * Update recording time - on demand join/leave
   * @param params 
   */
  updateRecordingTime(params) {
    params.token = this.userDetails.token;
    this.meetingRecordingsService.updateRecordingTime(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }
        }
      )
  }

  /**
   * Process schedules
   * @param schedules 
   */
  processSchedules(schedules) {
    for(let i=0; i<schedules.length; i++){
      let localTime = moment.utc(schedules[i].scheduled_date_utc).local().format('DD MMM. YYYY, hh:mm a');
      schedules[i].scheduled_date_utc = localTime;
    }
    this.schedules = schedules;
  }

  /**
   * Update recording(on demand) leave time while close recording modal
   */
  closeRecording() {
    $("#rec-video").remove();
    // Update on demand leave time
    let params:any = {};
    params.meeting_id = this.meetingId;
    params.rec_status = 2; // Stop
    this.updateRecordingTime(params);
  }

  /**
   * Show success toastr message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  /**
   * Show error toastr message
   * @param msg 
   */
  showFailure(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Format date
   * @param recDate 
   */
  formatDate(recDate) {
    return moment(recDate, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY');
  }

  /**
   * Format time
   * @param recDate 
   */
  formatTime(recDate) {
    return moment(recDate, 'YYYY-MM-DD hh:mm:ss').format('hh:mm a');
  }

  /**
   * Format date and time
   * @param recDate 
   */
  formatDateTime(recDate) {
    return moment(recDate, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY [at] hh:mm a');
  }

  /**
   * Get timezone abbreviation from timezone
   * @param timezone 
   */
  formatTimezone(timezone) {
    let tz = timezone.split(" ");
    if ( tz[1] !== void 0 ) {
      return moment().tz(tz[1]).zoneAbbr(); 
    }else{
      return false;
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
   * Share recording URL
   * @param recId 
   */
  shareRecording(recId){
    if(recId!=''){
      for(let i=0; i<this.recordings.length; i++){
        if(this.recordings[i].id == recId){
          let shareLink = '';
          let meetingId = this.recordings[i].m_id;
          let recId = this.recordings[i].video_id;
          shareLink = this.conferenceUrl + '?meetingId='+meetingId+'&role=1'+'&recId='+recId; // Role - attendee
          this.recLink = shareLink;
          $("#share-recording").modal({'show':true});
        }
      }
    }
  }

  /**
   * Filter recordings based on schedule
   * @param schId 
   */
  filterRecordings(schId = '') {
    if(schId != ''){
      let recList = _.filter(this.allRecordings, ['schedule_id', schId]);
      this.recordings = recList;
    }else{
      this.recordings = this.allRecordings;
    }
    this.groupRecordings();
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

}
