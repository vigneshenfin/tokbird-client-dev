import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'app/meeting/meeting.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/shared/user';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
declare var $:any;
declare var Clipboard:any;

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css'],
  providers: [MeetingService]
})
export class GeneralInfoComponent implements OnInit {
  public userDetails;
  public meetingId = '';
  public meeting:any = {};
  public reminderTypes = ["", "minutes", "hours", "days", "weeks"];

  constructor(private user: User, private activatedRoute:ActivatedRoute, private meetingService: MeetingService, public toastr: ToastsManager, vcr: ViewContainerRef, private router:Router, private toastrService: ToastrService) {
    this.userDetails   = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
  }

  // showSuccess(msg) {
  //   this.toastr.success(msg, 'Success!');
  // }
  // showError(msg) {
  //   this.toastr.error(msg, 'Failure!');
  // }

  showError(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.getMeeting();

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
      
      var clipboard = new Clipboard('.copy-link-btn');
      
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
  }

  copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr('data-copy-url')).select();
    document.execCommand("copy");
    $temp.remove();
    this.showSuccess('Copied');
    // $(element+'-msg').text('Copied successfully.').fadeOut(3000);
    // $(element+'-msg').text('Copied successfully').fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
  }

  getMeeting(){
    if(this.meetingId != ''){
       let meetingParams:any = {};
       meetingParams.meeting_id = this.meetingId;
       meetingParams.token = this.userDetails.token;
       this.meetingService.getMeeting(meetingParams).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.processResponseData(response.body.meeting);
          }
        },
        (error) => { 
          console.log(error);
          error = JSON.parse(error['_body']);
        }
      );
    }
  }

  processResponseData(meetingInfo) {
    // console.log(meetingInfo);
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

  cancelMeeting(meetingId) {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_id = meetingId;
    this.meetingService.cancelMeeting(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.showSuccess(response.message);
          $("#delete-pop").modal('hide');
          this.sendCancellation(params);
          this.router.navigateByUrl('meetings-list');
        }
      },
      (error) => { 
        // console.log(error);
        error = JSON.parse(error['_body']);
        // this.showError($(error.message).text());
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }else{
          this.showError($(error.message).text());
        }
      }
    );
  }

  sendCancellation(params) {
    this.meetingService.sendCancellation(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
        }
      },
      (error) => { 
        // console.log(error);
      }
    );
  }


}
