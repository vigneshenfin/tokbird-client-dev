import { Component, OnInit,Output,ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm,ReactiveFormsModule, FormGroup,FormBuilder } from '@angular/forms';
import { User } from "app/shared/user";
import { StorageService } from "app/shared/storage.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewUserService } from 'app/admin/users/view-user/view-user.sevrice';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
  providers:[ViewUserService]
})
export class ViewUserComponent implements OnInit {
  public editMainInfo:boolean         = false;
  public editSubscriptionInfo:boolean = false;
  public editFeaturesInfo:boolean     = false;
  public userId:number;                
  public userDetails;
  public token;
  public user_email;
  public main_info:any                = [];
  public plan_info:any                = [];
  public payment_info:any             = [];
  public permission_info:any          = [];
  public currentPlanCharge:any        = "";
  public CurrentPlanPeriod:any        = "";
  public currentPlanAttendees:any     = "";
  public preRegistration:number       = 0 ;
  public securitySettings:number      = 0 ;
  public MeetingRecordings:number     = 0 ;
  public questionsAndAnswers:number   = 0 ;
  public meetingReport:number         = 0 ;
  public reportsSection:number        = 0 ;
  public meetingLayout:number         = 0 ;
  public defaultPermission:number     = 0 ;
  public coporatePlan:boolean         = false;
  public currentPlan:number           = 0;
  public userName:any                 = "";
  public userEmail:any                = "";
  public currentPlanName:any          = "";
  private form: NgForm;
  public country:any                  = "";
  public avg_bandwidth:any            = "";
  public us_name_err                  = "";
  public us_email_err                 = "";
  public us_email_error_class         = "";
  public us_name_error_class          = "";
  public subscription:any;
  public payment_period :any          = 1;
  public subscription_err_class       = "";
  public payment_period_err_class     = "";
  public attendees_count_err_class    = "";
  public price_err_class              = "";
  public isFreeGranted:number;
  public currentPlanPayment:any       = "";
  public existingPlan:any             = "";
  public save_error_msg:any           = "";
  public loader_class:any             = "";
  constructor(private user:User,private router:Router, private activatedRoute:ActivatedRoute, public toastr: ToastsManager, vcr: ViewContainerRef,private viewUserService:ViewUserService) { 
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId   = params['userId'];
    });
    this.getUserDetails();
  }
  getUserDetails(){
        let params:any = {};
        params.token   = this.token;
        params.id      = this.userId;
        this.viewUserService.getUserDetails(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.main_info        = response.body.user_main_info;
              this.plan_info        = response.body.plan_info;
              this.payment_info     = response.body.payment_info;
              this.permission_info  = response.body.permission_info;
              this.currentPlan      = this.main_info.us_subscribed_plan_id;
              this.existingPlan     = this.main_info.us_subscribed_plan_id;
             // this.isFreeGranted    = this.main_info.is_free_subscription_granted;
              if(this.currentPlan == 4){
                this.payment_period    = this.main_info.corporate_plan_period;
              }else{
                this.payment_period     = this.main_info.us_subscribed_payment_option;
                this.currentPlanPayment = this.main_info.us_subscribed_payment_option;
              }
              this.userName         = this.main_info.us_name;
              this.userEmail        = this.main_info.us_email;
              this.currentPlanName  = this.main_info.plan_name;
              this.country          = this.main_info.us_country;
              this.avg_bandwidth    = this.main_info.us_bandwidth;
              this.getSubscriptionInfo();
              this.getPermissions(this.permission_info);
              
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/admin/login');
                this.showError(error.message);
              }
          }
    );
  }

  getPermissions(permission_info){

    permission_info.forEach(element => {
      let permission_id     = element['permission_id'];
      let permission_name   = element['permission_name'];
      switch (permission_name) {
        case "Edit pre-registration form":
          this.preRegistration      = permission_id;
          break;
        case "Edit security settings":
          this.securitySettings     = permission_id;
          break;
        case "Access to Meeting recordings":
          this.MeetingRecordings    = permission_id;
          break;
        case "Access to Q&A section":
          this.questionsAndAnswers  = permission_id;
          break;
        case "Access to Meeting report":
          this.meetingReport        = permission_id;
          break;
        case "Access to Reports section":
          this.reportsSection       = permission_id;
          break;
        case "Manage Meeting layout":
          this.meetingLayout        = permission_id;
          break;
        default:
          this.defaultPermission    = permission_id;

    }
    
  });
  
  //console.log('pre'+this.preRegistration+'sec'+this.securitySettings+'meeting recs'+this.MeetingRecordings+'question and answers'+this.questionsAndAnswers+'report'+this.meetingReport)
    
  }


  getSubscriptionInfo(){
      this.currentPlanName  = this.main_info.plan_name;
      this.subscription     = this.main_info.us_subscribed_plan_id;
      this.payment_info.forEach(element => {
        if(element['id'] != 4 && element['id'] == this.main_info.us_subscribed_payment_option){
          this.currentPlanCharge = element['charge'];
          this.CurrentPlanPeriod = element['time_period'];
        }
      });

      if(this.currentPlan == 4){
          this.currentPlanAttendees = this.main_info.plan_attendees_count;
          this.currentPlanCharge    = this.main_info.corporate_plan_amount;
          if(this.main_info.corporate_plan_period == '1'){
            this.CurrentPlanPeriod = "Monthly";
          }else{
            this.CurrentPlanPeriod = "Yearly";
          }
          
      }
     
      this.plan_info.forEach(element => {
        if(element['id'] != 4 && element['id'] == this.main_info.us_subscribed_plan_id){
          this.currentPlanAttendees = element['attendees_count'];
        }else if(element['id'] == 4 && element['id'] == this.main_info.us_subscribed_plan_id){
          this.currentPlanAttendees = this.main_info.plan_attendees_count;
          
        }
      });
  }
  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }
  mainInfoEdit(){
    this.editMainInfo = true;
  }

  subscriptionInfoEdit(){
    this.editSubscriptionInfo = true;
  }

  featuresInfoEdit(){
    this.editFeaturesInfo = true;
  }

  saveMainInfo(){
    let errCount = 0;
    this.us_name_error_class  = "";
    this.us_email_error_class = "";
    if(this.userName == ""){
      this.us_name_error_class = "has-error";
      errCount++;
    }
    if(this.userEmail == ""){
      this.us_email_error_class = "has-error";
      errCount++;
    }
    let params:any    = {};
    params.id         = this.userId;
    params.us_name    = this.userName;
    params.us_email   = this.userEmail;
    params.token      = this.token;
    params.type       = "main_info";
    if(errCount == 0){
      this.viewUserService.saveUserData(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.editMainInfo = false;
                this.showSuccess(response.message);
                this.us_email_error_class = "";
                this.us_email_err         = "";
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                  this.us_email_error_class = "has-error";
                  this.us_email_err = error.message;
                }
            }
      );  
    } 
  }
  saveSubscriptionInfo(){
    
    let errCount              = 0;
    if(this.subscription == ""){
      this.subscription_err_class = "has-error";
      errCount++;
    }
    if(this.currentPlan != 1){
      if(this.payment_period == ""){
        this.payment_period_err_class   = "has-error";
        errCount++;
      }
    }
    if(this.currentPlan == 4){
      if(this.currentPlanAttendees == ""){
        this.attendees_count_err_class = "has-error";
        errCount++;
      }

      if(this.currentPlanCharge == ""){
        this.price_err_class           = "has-error";
        errCount++;
      }
    }

    if((this.currentPlanPayment == this.payment_period ) && (this.subscription == this.existingPlan)){
      this.save_error_msg    = "Alert : This user is already in the same plan & billing cycle !!";
      errCount++;
    }
    if(errCount == 0){
      // display loade image
      this.loader_class = "payment-overly";

      //console.log(this.currentPlan+'dfgdfgd'+this.subscription);
      let params:any            = {};
      params.id                 = this.userId;
      params.token              = this.token;
      params.subscription       = this.subscription;
      params.attendees_count    = this.currentPlanAttendees;
      params.payment_option     = this.payment_period;
      params.charge             = this.currentPlanCharge;
      //params.isFreeGranted      = this.isFreeGranted;
      params.type               = "subscription_info";
      
      this.viewUserService.saveUserData(params)
            .subscribe(
            (response:any) => {
              this.loader_class = "";
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
                this.editSubscriptionInfo       = false;
                this.subscription_err_class     = "";
                this.payment_period_err_class   = "";
                this.attendees_count_err_class  = "";
                this.price_err_class            = "";
                this.save_error_msg             = "";
              }
            },
            (error) => {
                this.loader_class = "";
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                      this.save_error_msg = error.message;
                }
            }
      );  
    }
    
  }
  saveFeaturesInfo(){
     //console.log('pre'+this.preRegistration+'sec'+this.securitySettings+'meeting recs'+this.MeetingRecordings+'question and answers'+this.questionsAndAnswers+'report'+this.meetingReport)
    this.editFeaturesInfo       =false;
    let params:any              = {};
    params.id                   = this.userId;
    params.token                = this.token;
    params.preRegistration      = this.preRegistration;
    params.securitySettings     = this.securitySettings;
    params.MeetingRecordings    = this.MeetingRecordings;
    params.questionsAndAnswers  = this.questionsAndAnswers;
    params.meetingReport        = this.meetingReport;
    params.reportsSection       = this.reportsSection;
    params.meetingLayout        = this.meetingLayout;
    params.type                 = "features_info";

    this.viewUserService.saveUserData(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }
            }
      );  
  }

  cancelMainInfo(){
    this.editMainInfo = false;
    this.userName     = this.main_info.us_name;
    this.userEmail    = this.main_info.us_email;
  }
  cancelSubscriptionInfo(){
    this.save_error_msg       = "";
    this.editSubscriptionInfo = false;
    this.currentPlan          = this.main_info.us_subscribed_plan_id;
    this.currentPlanName      = this.main_info.plan_name;
    this.subscription         = this.main_info.us_subscribed_plan_id;
    if(this.currentPlan == 4){
      this.payment_period     = this.main_info.corporate_plan_period;
    }else{
      this.payment_period     = this.main_info.us_subscribed_payment_option;
    }
    this.getSubscriptionInfo();
  }
  cancelFeaturesInfo(){
    this.editFeaturesInfo =false;
    this.preRegistration = 0;
    this.securitySettings = 0;
    this.MeetingRecordings = 0;
    this.questionsAndAnswers = 0;
    this.meetingReport = 0;
    this.reportsSection = 0;
    this.meetingLayout = 0;
    this.getPermissions(this.permission_info);
  }

  onPlanChange(value){
    
    this.currentPlan                = value;
    this.payment_period             = "";
    this.subscription_err_class     = "";
    this.payment_period_err_class   = "";
    this.attendees_count_err_class  = "";
    this.price_err_class            = "";
    this.save_error_msg             = "";
    
    if(this.currentPlan == this.main_info.us_subscribed_plan_id){
        this.getSubscriptionInfo();
    }else{
        this.plan_info.forEach(element => {
        if(this.currentPlan != 4 && element['id'] == this.currentPlan){
          this.currentPlanAttendees = element['attendees_count'];
          this.currentPlanName      = element['plan_name'];
        }else if(element['id'] == 4 && element['id'] == this.currentPlan){
          this.currentPlanAttendees = "";
          this.currentPlanCharge    = "";
          this.currentPlanName      = element['plan_name'];
          this.payment_period       = 2;
          this.CurrentPlanPeriod    = "Yearly";
        }
      });
      this.payment_info.forEach(element => {
        if(element['plan_id'] == this.currentPlan){
          this.payment_period    = element['id'];
          this.currentPlanCharge = element['charge'];
          this.CurrentPlanPeriod = element['time_period'];
        }
      });
    }
   
  }

  onPaymentChange(value){
    this.subscription_err_class     = "";
    this.payment_period_err_class   = "";
    this.attendees_count_err_class  = "";
    this.price_err_class            = "";
    this.save_error_msg             = "";
    this.payment_period             = value;
    if((this.currentPlan == this.main_info.us_subscribed_plan_id && this.payment_period == this.main_info.us_subscribed_payment_option)|| (this.currentPlan == this.main_info.us_subscribed_plan_id && this.payment_period == this.main_info.corporate_plan_period)){
        this.getSubscriptionInfo();
    }else if(this.currentPlan == 4){
        if(this.payment_period == 1){
          this.CurrentPlanPeriod = "Monthly";
        }else{
          this.CurrentPlanPeriod = "Yearly";
        }
        this.currentPlanCharge   = "";
    }else{
      this.payment_info.forEach(element => {
        if(element['id'] == this.payment_period){
          this.currentPlanCharge = element['charge'];
          this.CurrentPlanPeriod = element['time_period'];
        }
      });
    }
   
    
  }

  

}
