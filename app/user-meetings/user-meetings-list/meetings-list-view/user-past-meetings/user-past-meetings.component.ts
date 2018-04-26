import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserMeetingsListService } from 'app/user-meetings/user-meetings-list/user-meetings-list.service';
import { Subscription } from 'rxjs';
import { User } from 'app/shared/user';

declare var moment;

@Component({
  selector: 'app-user-past-meetings',
  templateUrl: './user-past-meetings.component.html',
  styleUrls: ['./user-past-meetings.component.css'],
  providers: [UserMeetingsListService]
})
export class UserPastMeetingsComponent implements OnInit {

  @Input() selectedTab;
  public userDetails;
  public pastMeetings:any = [];
  public pastLimit = 10;
  public pastOffset = 1;
  public roleId;
  public urlPrefix = '';
  public pastRecordDetails:any = [];
  public pastKeyword = '';
  pastIsDataAvailable:boolean = false;
  pastP: number = 1;
  pastBusy: Subscription;

  constructor(private userMeetingsListService: UserMeetingsListService, private user:User, private router:Router, private activatedRoute:ActivatedRoute) { 
    this.userDetails = user.getUser();
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
  }

  ngAfterViewInit() {
  }

  ngOnChanges() {
    if(this.selectedTab == 'past_meetings'){
      this.getUserMeetings();
    }
  }

  getUserMeetings() {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_status = '3';
    params.limit = this.pastLimit;
    params.offset = this.pastOffset;
    this.userMeetingsListService.getUserMeetings(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success==1){
            this.pastP = this.pastOffset;
            this.pastRecordDetails = response.body.records;
            this.pastIsDataAvailable = true;
            this.pastMeetings = response.body.meetings;
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }
        }
    );
    
  }

  pageChanged(event) {
    this.pastOffset = event;
    this.getUserMeetings();
  }

  formatDate(date) {
    return moment(date, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
  }

  transform(value: string) {
    let limit = 30;
    let trail = '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
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

}
