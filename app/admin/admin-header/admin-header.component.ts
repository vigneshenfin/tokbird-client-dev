import { Component, OnInit, Input } from '@angular/core';
import {Injectable,EventEmitter} from '@angular/core';
import { Router, RouterLinkActive, ActivatedRoute, Params } from '@angular/router';
import { UserMeetingsListService } from 'app/user-meetings/user-meetings-list/user-meetings-list.service';
import { User } from "app/shared/user";
import { Config } from "app/config/config";


@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
  providers: [UserMeetingsListService]
})

export class AdminHeaderComponent implements OnInit {

  public userDetails;
  public userId;
  public us_image;
  public us_role_id;
  public urlPrefix = '';
  public meetingId = '';
  public urlParam = '';
  public meetingAccount = '';
  public defaultImgPath;
  
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:User, private userMeetingsListService: UserMeetingsListService) {
    this.userDetails = user.getUser();
    this.userId      = this.userDetails.id;
    this.us_role_id  = this.userDetails.us_role_id;
    if(this.us_role_id == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.us_role_id == '2'){
      this.urlPrefix = '/facilitator';
    }
    this.defaultImgPath = Config.BASE_API_URL+'assets/uploads/user/default.jpg';
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['meetingId']){
        this.meetingId   = params['meetingId'];
        this.urlParam = btoa(this.meetingId);
      }
    });
    // Added - 24/11/2017
    if(this.meetingId != ''){
      this.getUserAccount();
    }
    // console.log(this.meetingId);
    if(this.userDetails.us_image){
      this.us_image    = this.userDetails.us_image;
    }
    this.user.updateProPicEvent.subscribe(
       (pic) => this.changePic(pic)
    );
  }

  onLogout(){
    this.user.logOut();
    if(this.us_role_id == 1){
      this.router.navigateByUrl('/admin/login');
    }else{
      this.router.navigateByUrl('/');
    }
  }

  changePic(pic){
    this.us_image = pic;
  }

  // Added - 24/11/2017
  getUserAccount() {
    let params:any = {};
    params.route_meeting_id = this.meetingId;
    params.token = this.userDetails.token;
    this.userMeetingsListService.getMeetingAccount(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.meetingAccount = response.body.meeting_account;
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

  // Added - 16/11/2017
  redirectLogin()
  {
    if(this.us_role_id == '1') {
      // Admin
      this.router.navigateByUrl('/admin/login');
    }else{
      // Facilitator/Registered user
      this.router.navigateByUrl('/');
    }
  }

  redirectHome()
  {
    if(this.us_role_id == '3'){
      // Registered user
      this.router.navigateByUrl('/meetings-list');
    }else{
      // Admin/Facilitator
      this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
    }
  }

}
