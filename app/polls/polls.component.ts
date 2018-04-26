import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PollsService } from 'app/polls/polls.service';
import { User } from 'app/shared/user';
import { Subscription } from 'rxjs';
import { ToastrService } from 'toastr-ng2';
declare var moment:any;
declare var $:any;

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css'],
  providers: [PollsService]
})

export class PollsComponent implements OnInit {
  
  public userDetails;
  public limit = 10;
  public offset = 1;
  public polls:any = [];
  public recordDetails:any = [];
  public keyword = '';
  public search = '';
  public pollToDelete = '';
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  p: number = 1;
  busy: Subscription;
  
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private pollsService:PollsService, private user:User, private toastrService: ToastrService) {
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
        this.routeMeetingId = params['meetingId'];
      }
    });
    // Added - 14/11/2017
    if(this.roleId != '3'){
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
        this.getPolls();
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }else{
      this.getPolls();
    }
  }

  /**
   * Get polls
   * @author Paul P Elias
   * @date 2017-10-16
   */
  getPolls() {
    let params:any = {};
    params.limit = this.limit;
    params.offset = this.offset;
    params.token = this.userDetails.token;
    params.keyword = this.search;
    // Added - 18/11/2017
    params.route_meeting_id   = this.routeMeetingId;
    this.busy = this.pollsService.getPolls(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.polls = [];
          let pollsList = response.body.polls;
          this.p = this.offset;
          this.recordDetails = response.body.records;
          for(let i=0; i<pollsList.length; i++){
            let poll:any ={};
            poll.id = pollsList[i].id;
            poll.title = pollsList[i].title;
            // Changed - 31/01/2018 - Convert UTC to local
            // poll.created_at = moment(pollsList[i].created_at, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
            let localTime = moment.utc(pollsList[i].created_at).local().format('DD MMM. YYYY, hh:mm a');
            poll.created_at = localTime;
            this.polls.push(poll);
          }
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
   * Pagination
   * @param event 
   */
  pageChanged(event) {
    this.offset = event;
    this.getPolls();
  }

  /**
   * Search poll
   * @param event 
   * @param formInfo 
   */
  searchPoll(event, formInfo:NgForm) {
    if(formInfo.valid){
      this.search = formInfo.value.keyword;
      this.getPolls();
    }
  }

  /**
   * Confirmation modal to delete poll
   * @param pollId 
   */
  confirmDelete(pollId){
    if(pollId != ''){
      this.pollToDelete = pollId;
      $("#delete-pop-polls").modal({'show':true});
    }
  }

  /**
   * Delete poll
   * @param pollId 
   */
  deletePoll(pollId){
    if(pollId != ''){
      let params:any = {};
      params.poll_id = pollId;
      params.token = this.userDetails.token;
      params.route_meeting_id = this.routeMeetingId;
      this.pollsService.deletePoll(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            $("#delete-pop-polls").modal('hide');
            this.getPolls();
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }else{
            this.showFailure(error.message);
            $("#delete-pop-polls").modal('hide');
          }
        }
      )
    }
  }

  /**
   * Toastr success messsage
   * @param msg 
   */
  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  /**
   * Toastr error message
   * @param msg 
   */
  showFailure(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Reset poll serach form
   * @param event 
   * @param searchForm 
   */
  resetSearch(event, searchForm:NgForm) {
    searchForm.resetForm();
    this.searchPoll(event, searchForm);
  }

  /**
   * Redirect to login page based on user role (Admin/Facilitator/Registered user)
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
   * Redirect to home page based on user role (Admin/Facilitator/Registered user)
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

}
