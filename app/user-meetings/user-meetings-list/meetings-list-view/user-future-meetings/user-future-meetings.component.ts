import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserMeetingsListService } from 'app/user-meetings/user-meetings-list/user-meetings-list.service';
import { Subscription } from 'rxjs';
import { User } from 'app/shared/user';
// import {TruncatePipe} from 'app/truncate';
declare var moment;

@Component({
  selector: 'app-user-future-meetings',
  templateUrl: './user-future-meetings.component.html',
  styleUrls: ['./user-future-meetings.component.css'],
  providers: [UserMeetingsListService],
  // pipes: [TruncatePipe]
})

export class UserFutureMeetingsComponent implements OnInit {

  // @Pipe({
  //   name: 'limitTo'
  // })

  @Input() selectedTab;
  public userDetails;
  public meetings:any = [];
  public limit = 10;
  public offset = 1;
  public roleId;
  public urlPrefix = '';
  public recordDetails:any = [];
  public keyword = '';
  isDataAvailable:boolean = false;
  p: number = 1;
  busy: Subscription;

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
    if(this.selectedTab == 'future_meetings'){
      this.getUserMeetings();
    }
  }

  getUserMeetings() {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_status = '1';
    params.limit = this.limit;
    params.offset = this.offset;
    this.busy = this.userMeetingsListService.getUserMeetings(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success==1){
            this.p = this.offset;
            this.recordDetails = response.body.records;
            this.isDataAvailable = true;
            this.meetings = response.body.meetings;
            // console.log(this.meetings);
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
    this.offset = event;
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
