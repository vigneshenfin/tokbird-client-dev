import { Component, OnInit, OnChanges, Input  } from '@angular/core';
import { User } from 'app/shared/user';
import { ListViewService } from 'app/meeting/meetings-list/list-view/list-view.service';
import { MeetingService } from 'app/meeting/meeting.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
  providers:[ListViewService, MeetingService]
})
export class ListViewComponent implements OnInit, OnChanges {
  public meetingParams:any = {};
  public userDetails;
  public pastMeetings:any;
  public meetings:any;
  public keyword = '';
  public pastKeyword = '';
  public meetList;
  public cancelMeetingId   = '';
  @Input() parentData:any; // from component 1
  constructor(private user:User, private listViewService:ListViewService, private activatedRoute:ActivatedRoute, private meetingService: MeetingService, public toastr: ToastsManager, vcr: ViewContainerRef, private router:Router) {
    this.userDetails   = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadMeetings('future');
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  ngOnChanges() {
  }

  ngAfterViewChecked() {
  }

  ngAfterViewInit() {
  }

  ngDoCheck() {
  }


  loadTable()
  {
    this.keyword = '';
    this.pastKeyword = '';
    $(document).ready(function(){
      $('#datatable-responsive').dataTable({
        responsive: true,
        "bDestroy": true,
        "columnDefs": [
                          { "targets": [2,3,4,5,6], "searchable": false }
                      ]
      }).fnDraw(false);
      $("#future_meetings_search").show();
      $("#past_meetings_search").hide();
    });
    this.meetList   = 1;
  }

  loadPastTable() {
    this.keyword = '';
    this.pastKeyword = '';
    $(document).ready(function(){
      $('#datatable-responsive2').dataTable({
        responsive: true,
        "bDestroy": true,
        "columnDefs": [
                          { "targets": [2,3,4,5,6], "searchable": false }
                      ]
      }).fnDraw(false);
      $("#future_meetings_search").hide();
      $("#past_meetings_search").show();
    });
    this.meetList   = 0;
  }

  loadMeetings(meeting_status){
    if(meeting_status != ''){
      this.meetingParams.token = this.userDetails.token;
      if(meeting_status == 'past'){
        this.meetingParams.meeting_status = 3;
      }else{
        this.meetingParams.meeting_status = 1;
      }
      this.listViewService.getMeetings(this.meetingParams).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success==1){
            this.meetings = response.body.meetings;
            this.loadTable();
          }
        },
        (error) => {
          // console.log(error)
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }
        }
      );
    }

  }

  loadFutureMeetings() {
    this.meetingParams.token = this.userDetails.token;
    this.meetingParams.meeting_status = 'future';
    this.listViewService.getMeetings(this.meetingParams).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success==1){
          this.meetings = response.body.meetings;
          this.loadTable();
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  loadPastMeetings() {
    this.meetingParams.token = this.userDetails.token;
    this.meetingParams.meeting_status = 'past';
    this.listViewService.getMeetings(this.meetingParams).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success==1){
          this.pastMeetings = response.body.meetings;
          this.loadPastTable();
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  searchMeeting() {
    $('#datatable-responsive').dataTable().fnFilter(this.keyword.toLowerCase(), 0, true);
  }

  searchPastMeeting() {
    $('#datatable-responsive2').dataTable().fnFilter(this.pastKeyword.toLowerCase(), 0, true);
  }

  searchMeet(event) {
    if(event.keyCode == 13){
      if(this.meetList == 0) {
        this.searchPastMeeting();
      }else{
        this.searchMeeting();
      }
    }
  }

  cancelMeeting(meetingId) {
    if(meetingId != '') {
      this.cancelMeetingId   = meetingId;
      $("#delete-pop1").modal({'show': true});
    }
  }



  cancelScheduledMeeting(meetingId) {
    if(meetingId != ''){
      let params:any = {};
      params.meeting_id = meetingId;
      params.token = this.userDetails.token;
      this.meetingService.cancelMeeting(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            this.removeMeeting(meetingId);
            $("#delete-pop1").modal('hide');
            this.sendCancellation(params);
          }
        },
        (error) => { 
          console.log(error);
          error = JSON.parse(error['_body']);
          this.showError($(error.message).text());
        }
      );
    }
  }

  removeMeeting(meetingId){
    for(let i=0; i<this.meetings.length; i++) {
      if(this.meetings[i].id == meetingId) {
        this.meetings.splice(i, 1);
      }
    }
  }

  sendCancellation(params) {
    this.meetingService.sendCancellation(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
        }
      },
      (error) => { 
        console.log(error);
      }
    );
  }

  

}
