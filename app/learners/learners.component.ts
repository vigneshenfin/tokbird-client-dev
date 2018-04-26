import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/shared/user';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'toastr-ng2';
import { LearnersService } from 'app/learners/learners.service';
import { Config } from 'app/config/config';

declare var $:any;

@Component({
  selector: 'app-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.css'],
  providers: [LearnersService]
})

export class LearnersComponent implements OnInit {

  public userDetails;
  public limit = 10;
  public offset = 1;
  public learners:any = [];
  public recordDetails:any = [];
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public learnersCsvError = 0;
  public uploadPath = '';
  public file = '';
  public csvFilename = '';

  public rowId = '';
  public learnerId = '';
  public name = '';
  public emailAddress = '';

  files : FileList;
  p: number = 1;
  busy: Subscription;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private LearnersService:LearnersService, private user:User, private toastrService: ToastrService) { 
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    this.uploadPath = Config.UPLOADS_PATH;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    this.getLearners();
  }

  /**
   * Get learners
   */
  getLearners()
  {
    let params:any = {};
    params.limit = this.limit;
    params.offset = this.offset;
    params.token = this.userDetails.token;
    this.busy = this.LearnersService.getLearners(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        this.p = this.offset;
        this.learners = response.body.learners;
        this.recordDetails = response.body.records;
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
    this.getLearners();
  }

  /**
   * Learner file input change
   * @param event 
   */
  getFiles(event){ 
    if(event.target.files && event.target.files[0]) {
      if((event.target.files[0].type == "application/vnd.ms-excel") || (event.target.files[0].type == "text/csv") || (event.target.files[0].type == "application/csv") || (event.target.files[0].type == "text/comma-separated-values")){
          this.files = event.target.files;
          let csvName = this.files[0].name;
          // Commented - 24/04/2018
          // this.csvFilename = csvName;

          let formData:FormData = new FormData();
          let params:any = {};
          params.token = this.userDetails.token;
          // console.log(params);
          formData.append('details', JSON.stringify(params));
          formData.append('file', this.files[0]); 
          // console.log(formData);
          this.LearnersService.uploadLearners(formData).subscribe(
            (response:any) => {
              response = JSON.parse(response['_body']);
              if(response.success == 1){
                this.learners = [];
                this.limit = 10;
                this.offset = 1;
                this.p = 1;
                this.getLearners();
                this.showSuccess('File uploaded successfully');
              }
            },
            (error) => {
            }
          )
      }else{
        // this.csvFilename = '';
        this.showFailure('Invalid file');
      }
    }else{
      // this.csvFilename = '';
      $("#learnerFile").value = "";
    }
  }

  /**
   * Show delete confirmation modal
   * * @param rowId 
   */
  confirmDelete(rowId = '') {
  }

  /**
   * Edit learner details
   * @param rowId 
   */
  editLearner(rowId = '') {
    if(rowId != ''){
      let params:any = {};
      params.token = this.userDetails.token;
      params.id = rowId;
      this.LearnersService.getLearner(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            let learnerDetails = response.body.learner;
            if(Object.keys(learnerDetails).length > 0){
              this.rowId = learnerDetails.id;
              this.learnerId = learnerDetails.learner_id;
              this.name = learnerDetails.name;
              this.emailAddress = learnerDetails.email_address;
              $("#edit-learner").modal({'show': true});
              // console.log('enter here');
            }else{
              // console.log(learnerDetails);
            }
          }
        },
        (error) => {
        }
      )
    }
  }

  /**
   * Save learner
   * @param rowId 
   */
  saveLearner(event, learnerInfo:NgForm) {
    if(learnerInfo.valid) {
      alert();
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
