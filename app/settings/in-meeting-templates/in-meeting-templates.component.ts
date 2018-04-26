import { Component, OnInit , ViewContainerRef, ViewChild, Input} from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ColorPickerService, Rgba } from 'ngx-color-picker';
import { MeetingContentService } from 'app/meeting-content/meeting-content.service';
import { InMeetingTemplatesService } from 'app/settings/in-meeting-templates/in-meeting-templates.service';
declare var $:any;
@Component({
  selector: 'app-in-meeting-templates',
  templateUrl: './in-meeting-templates.component.html',
  styleUrls: ['./in-meeting-templates.component.css'],
  providers : [MeetingContentService,InMeetingTemplatesService]
})
export class InMeetingTemplatesComponent implements OnInit {

  @Input() routeMeetingId;
  @ViewChild('f') public fieldForm: NgForm;
  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "email";
  public sortOrder = "asc";
  public header_bg_color: string = "#03a9f4";
  public footer_bg_color: string = "#f2f2f2";
  public footer_txt_color: string = "#333333";
  public header_bg_color_style:string = "#f2f2f2";
  public footer_txt = "Privacy statement | Using this site means you accept its terms © 2018 Tokbird Conference Solution, Inc. All rights reserved. ";
  public userDetails;
  public token;
  public customAudio:any;
  public upload_image_name:any;
  public saved_image_name:any;
  public logo:any;
  public check_audio_type = 1;
  public selctedAudio   = '';
  public selectedOption = '';
  public details:any = {};
  public final_name:any;
  public savedCustomAudio:any;
  public templateToDelete = '';
  public open_model:any;
  iscustomAudioClick:boolean = false;
  template_id ='';

//   Changed - 16/11/2017
//   meetingId = '';
  title = '';
  templateLists;
  templateDetails;
  audio_id;
  audio_filename;
  audio_filepath;
  defaultAudios;
  response;
  dropDisableClass;
  audio_type;
  files : FileList; 
  logo_file : FileList;
  mp3_file :FileList;
  hideCustomAudioSection:boolean = false;
  hideDefaultAudioSection:boolean = false;
  logo_error  = "";
  audio_error = "";
  fileExtension: any;
  errorCount = 0;
  upload_error_message ="Please upload an audio";
  select_audio_error   = "Please choose audio.";
  save_template:boolean = false;
  //   Added - 31/01/2018
  public allDataFetched:boolean = false;
  //   Changed - 16/11/2017
  public roleId;
  public urlPrefix = '';
  constructor(private http:Http,private router:Router, private activatedRoute:ActivatedRoute,private meetingContentService:MeetingContentService,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef,public inMeetingTemplatesService:InMeetingTemplatesService) { 
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.toastr.setRootViewContainerRef(vcr);
    // Added - 16/11/2017
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  ngOnInit() {

    $(document).on('focusin', function(e) {
        if ($(e.target).closest(".mce-window").length) {
            e.stopImmediatePropagation();
        }
    });
    
    // Added - 16/11/2017
    if(this.roleId != '3'){
      //   Admin/Facilitator
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }
    // var params = { 'token':this.token ,'module' : 'true'} ;
    // Changed - 16/11/2017
    var params = { 'token':this.token ,'module' : 'true', 'route_meeting_id': this.routeMeetingId};
    this.meetingContentService.listMeetingTemplates(params)
          .subscribe(
            (response:any) => {
              //   Added - 31/01/2018
              this.allDataFetched = true;
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.data = response.body;
                //console.log(this.templateLists)
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.showError(error.message);
                //   this.router.navigateByUrl('/');
                // Added - 16/11/2017
                this.redirectLogin();
                }else{
                    // Added - 17/11/2017
                    this.redirectHome();
                }
            }
          );

      //   Changed - 16/11/2017
    //   this.meetingContentService.listDefaultAudios(this.token)
      this.meetingContentService.listDefaultAudios({"token": this.token, "route_meeting_id": this.routeMeetingId})
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.defaultAudios = response.body;
                // console.log(this.defaultAudios)
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                //   this.router.navigateByUrl('/');
                // Added - 16/11/2017
                this.redirectLogin();
                  this.showError(error.message);
                }
            }
          );
      
  
// console.log('data:' + this.data)
  }


    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    getSelectedAudio(audio){
        this.selctedAudio = audio.title;
        this.audio_id     = audio.id;
        // console.log(this.audio_id);
    }

    createTemplate(){
        this.template_id          = "";
        this.selctedAudio         = "";
        this.customAudio          = "";
        this.title                = "";
        this.logo                 = "";
        this.check_audio_type     = 1;
        this.savedCustomAudio     = "";
        this.saved_image_name     = "";
        this.upload_image_name    = "";
        let __this                = this;
        this.logo_error           = "";
        this.audio_error          = "";
        this.hideDefaultAudioSection = false;
        this.open_model           = false;
        this.header_bg_color      = "#03a9f4";
        this.footer_bg_color      = "#f2f2f2";
        this.footer_txt_color     = "#333333";
        this.header_bg_color_style= "#f2f2f2";
        this.footer_txt           = "Privacy statement | Using this site means you accept its terms © 2018 Tokbird Conference Solution, Inc. All rights reserved. ";
       // __this.fieldForm.resetForm();
        
    }

    onSubmit(event,meetingContent:NgForm){
        this.open_model           = true;
        if(meetingContent.valid){
            
            let formData:FormData           = new FormData();
            this.details.token              = this.token;
            this.details.title              = meetingContent.value.title;
            this.details.template_id        = this.template_id;
            this.details.header_bg_color    = this.header_bg_color;
            this.details.footer_bg_color    = this.footer_bg_color;
            this.details.footer_txt         = this.footer_txt;
            this.details.footer_txt_color   = this.footer_txt_color;
            // Added - 16/11/2017
            this.details.route_meeting_id = this.routeMeetingId;
            if(meetingContent.value.audio_type == '1'){
                this.details.audio_type = 1;
                // Added - 16/01/2018
                if(!this.audio_id){
                    this.errorCount++;
                    this.select_audio_error   = "Please choose audio.";
                }else if(this.audio_id == '' || this.audio_id == 0){
                    this.errorCount++;
                    this.select_audio_error   = "Please choose audio.";
                }else{
                    this.errorCount = 0;
                    this.details.audio_id   = this.audio_id;
                    this.select_audio_error   = "";
                }
            
            }else{
               
                this.details.audio_type = 2;
                if(this.savedCustomAudio =="" && this.customAudio == ""){
                    this.errorCount++;
                    this.upload_error_message ="Please upload an audio";
                }else{
                    this.errorCount = 0;
                    this.upload_error_message ="";
                }
            }
            formData.append('details', JSON.stringify(this.details));
            if(this.upload_image_name){
                formData.append('logo', this.logo_file[0]); 
            }
            if(this.customAudio){
                formData.append('audio_file', this.mp3_file[0]); 
            }
            //  console.log(formData)
            if(this.errorCount == 0){
                this.save_template = true;
                this.meetingContentService.saveTemplateInfo(formData).subscribe(
                        (response:any) => {
                        this.save_template = false;
                        response = JSON.parse(response['_body']);
                        if(response.success == 1){
                            this.showSuccess(response.message);
                        }
                        // console.log(this.template_id);
                        // update templates array
                        if(this.template_id != '' && this.template_id != null){
                            // console.log(response);
                            for(let i=0; i<this.data.length; i++){
                                if(this.data[i].id == this.template_id){
                                this.data[i].title = response.body.template_title;
                                }
                            }
                            // console.log(this.data);
                        }else{
                            let template:any = {};
                            template.id     = response.body.template_id;
                            template.title  = this.details.title;
                            this.data.push(template);
                            // console.log(this.data);
                        }
                        $("#creat_new_meeting_temp").modal('hide');

                        },
                        (error) => { 
                        this.save_template = false;
                        error = JSON.parse(error['_body']);
                        if(error.message == "Login failed"){
                        this.user.logOut();
                        // this.router.navigateByUrl('/');
                        // Added - 16/11/2017
                        this.redirectLogin();
                        }
                        if(!error.message.logo_err && !error.message.audio_err){
                            this.showError(error.message);
                        }else{
                            //this.showError('Failure occured while saving details !');
                            if(error.message.logo_err){
                            this.logo_error = "The uploaded file exceeds the maximum allowed size of 2MB";
                            }
                            if(error.message.audio_err){
                            this.audio_error = "The uploaded file exceeds the maximum allowed size of 2MB";
                            }

                        }
                    }
                );

            }


        
        }
        
    }

    getFiles(event,type){
        //console.log(event.target.files)
        if(event.target.files) {
        this.files = event.target.files; 
        if(type == 'image'){ 
            this.logo_file            = this.files;
            let upload_file_name      = this.logo_file[0].name;
            var allowedImgExtensions  = ["jpg","jpeg","png","JPG","JPEG"];
            this.fileExtension        = upload_file_name.split('.').pop();
            let check                 = allowedImgExtensions.filter(x => x == this.fileExtension);
            if(check.length !== 0){
                this.logo_error = '';
                var reader = new FileReader();
                reader.onload       = (event) => {
                this.logo           = event.target['result'];
                }
                reader.readAsDataURL(event.target.files[0]);
                this.upload_image_name = upload_file_name;
                this.saved_image_name  = this.upload_image_name;
            }else{
                if(this.saved_image_name){
                    this.logo               = this.templateDetails.logo;
                }else{
                    this.logo               = "assets/images/logo.png";
                }
                this.upload_image_name  = "";
                this.logo_error         = "Allowed image types are jpg | png | jpeg";
            } 
            
        }else{
            this.mp3_file               = this.files;
            let aud_filename            = this.mp3_file[0].name;
            var allowedAudioExtensions  = ["mp3"];
            this.fileExtension          = aud_filename.split('.').pop();
            let check                   = allowedAudioExtensions.filter(x => x == this.fileExtension);
            if(check.length !== 0){
                this.audio_error        = '';
                this.customAudio        = aud_filename;
            }else{
                this.customAudio        = "";
                this.audio_error        = "Allowed audio types are mp3";
            }
        }
        }
        
    }

    deleteTemplate(tempId) {
        if(tempId != ''){
        this.templateToDelete = tempId;
        $("#delete-pop-meeting-template").modal({'show': true});
        }
    }

    deleteMeetingTemplate(tempId) {
        if(tempId != ''){
        $("#delete-pop-meeting-template").modal('hide');
        // Delete template
        let params:any = {};
        params.token = this.userDetails.token;
        params.template_id = tempId;
        // Added - 16/11/2017
        params.route_meeting_id = this.routeMeetingId;
        this.inMeetingTemplatesService.deleteMeetingTemplate(params).subscribe(
            (response:any) => {
            response = JSON.parse(response['_body']);
            if(response.success == 1){
                // Delete from templates array
                for(let i=0; i<this.data.length; i++){
                if(this.data[i].id == tempId){
                    this.data.splice(i, 1);
                }
                }
                this.showSuccess(response.message);
            }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                this.showError(error.message);
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                //   this.router.navigateByUrl('/');
                    // Added - 16/11/2017
                    this.redirectLogin();
                }
            }

        )
        }
    }

    editTemplate(tempId){
        this.logo_error  = "";
        this.audio_error = "";
        this.template_id = tempId;
        // var params = {"token": this.token ,"template_id" : tempId }
        // Added - 16/11/2017
        var params = {"token": this.token ,"template_id" : tempId, 'route_meeting_id': this.routeMeetingId }
        this.meetingContentService.getTemplateInfo(params)
            .subscribe(
                (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success == 1){
                    this.templateDetails = response.body;
                    // console.log(this.templateDetails)
                    if(this.templateDetails !== {}){
                    this.title                = this.templateDetails.title;
                    this.logo                 = this.templateDetails.logo;
                    this.header_bg_color      = this.templateDetails.header_bg_color;
                    this.footer_bg_color      = this.templateDetails.footer_bg_color;
                    this.footer_txt           = this.templateDetails.footer_txt;
                    this.footer_txt_color     = this.templateDetails.footer_txt_color;
                    var logo_path             = this.logo;
                    this.saved_image_name     = logo_path.substr(logo_path.lastIndexOf('/') + 1);
                    this.check_audio_type     = parseInt(this.templateDetails.audio_type);
                    if(this.check_audio_type == 1){
                        this.selctedAudio      = this.templateDetails.audio_title;
                        this.savedCustomAudio  = "";
                        this.hideDefaultAudioSection =false;
                        //this.customAudio    = this.selctedAudio;
                    }else{
                        this.selctedAudio      = '';
                        var aud_file           = this.templateDetails.filename;
                        this.final_name        = aud_file.substr(aud_file.lastIndexOf('/') + 1);
                        this.savedCustomAudio  = this.final_name;
                        this.hideCustomAudioSection =false;
                        this.customAudio       = "";
                    }
                    this.audio_filepath = this.templateDetails.filename;
                    var audio         = {'id' : this.templateDetails.audio_id,'title':this.templateDetails.audio_title};
                    this.getSelectedAudio(audio);
                    }
                }
                $("#creat_new_meeting_temp").modal({'show':true});
                },
                (error) => {
                    error = JSON.parse(error['_body']);
                    this.showError(error.message);
                    if(error.message == "Login failed"){
                    this.user.logOut();
                    // this.router.navigateByUrl('/');
                        // Added - 16/11/2017
                        this.redirectLogin();
                    }
                }
            );
    }

    onChange(event) {
    }

    onSortOrder(event) {
    }

    activePage(event) {
    }

    onPageChange(event) {
    }

    defaultClick(){
        this.hideCustomAudioSection  = true;
        this.hideDefaultAudioSection = false;
        if(this.audio_id == "" || this.audio_id == 0){
            this.selctedAudio            = "";
        }
        this.upload_error_message = "";
        this.select_audio_error   = "";
    }
    customClick(){
        this.hideDefaultAudioSection = true;
        this.hideCustomAudioSection  = false;
        this.upload_error_message = "";
        this.select_audio_error   = "";
        this.customAudio          = "";
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

      changeHeaderBgColor(event){
        this.header_bg_color        = event;
        this.header_bg_color_style  = event;
        console.log(event);
      }

      changeFooterBgColor(event){
          this.footer_bg_color = event;
      }

      changeFooterTxtColor(event){
        this.footer_txt_color = event;
      }

}
