import { Component, OnInit } from '@angular/core';
// Added - 16/11/2017
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { User } from 'app/shared/user';
declare var $:any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [MeetingDetailsService]
})
export class SettingsComponent implements OnInit {

  // Added - 16/11/2017
  public userDetails;
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:User, private meetingDetailsService: MeetingDetailsService) { 
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
    this.activatedRoute.params.subscribe((params: Params) => {

    if(params['meetingId']){
        this.routeMeetingId   = params['meetingId'];
      }
    });
    
    if(this.roleId != '3'){
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
        // this.getMeetingStatus();
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }

    $(document).ready(function(){
      $('a[data-toggle="pill"]').on('show.bs.tab', function(e) {
          localStorage.setItem('activeTab', $(e.target).attr('href'));
      });
      var activeTab = localStorage.getItem('activeTab');
      if(activeTab){
          $('a[href="' + activeTab + '"]').tab('show');
      }
    });
  }

  // Added - 17/11/2017
  /**
   * Get status of a meeting - past or future
   * 
   * @author
   * @date 2017-10-26
   */
  getMeetingStatus() {
    let params:any = {};
    params.meeting_id   = this.routeMeetingId;
    params.token   = this.userDetails.token;
    this.meetingDetailsService.getStatus(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
        }else{
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

}
