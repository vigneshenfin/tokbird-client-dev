import { Component, OnInit,Output,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MeetingContentService } from 'app/meeting-content/meeting-content.service';
declare var $:any;
declare var Dropzone: any;
@Component({
  moduleId: module.id,
  selector: 'app-meeting-content',
  templateUrl: './meeting-content.component.html',
  styleUrls: ['./meeting-content.component.css'],
  providers : [MeetingContentService]
})
export class MeetingContentComponent implements OnInit {
  
  public userDetails;
  public token;
  public customAudio:any;
  public savedCustomAudio:any;
  public upload_image_name:any;
  public logo:any;
  public check_audio_type = 1 ;
  public selctedAudio   = '';
  public selectedOption = '';
  public details:any = {};
  public final_name:any;
  iscustomAudioClick:boolean = false;
  template_id;
  meetingId = '';
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
  templates_info:any;
  noTemplate:boolean = false;
  logo_error  = "";
  audio_error = "";
  hideCustomAudioSection:boolean = false;
  hideDefaultAudioSection:boolean = false;
  fileExtension: any;
  noTemplate_id:any;
  errorCount = 0;
  upload_error_message ="Please upload an audio";
  select_audio_error   = "Please choose audio.";
  save_template:boolean = false;

  constructor(private router:Router, private activatedRoute:ActivatedRoute,private meetingContentService:MeetingContentService,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.toastr.setRootViewContainerRef(vcr);
   }
  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  ngOnInit() {
  $(document).ready(function(){
    Dropzone.autoDiscover = false;
    Dropzone.options.myAwesomeDropzone = {
            url: '',
            accept: function(file, done) {
                console.log("uploaded");
                done();
            },
            init: function() {
                this.on("addedfile", function() {
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                });
            }
        };
  })
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    // To get meeting template information
    var info = { "token" : this.token ,"meeting_id" : this.meetingId }
    this.meetingContentService.meeting_templates_info(info)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.templates_info = response.body;
                if(this.templates_info !== {}){
                  if(this.templates_info.in_meeting_template_id !== "" && this.templates_info.in_meeting_template_id !==null){
                    var temp_info = { "id" : this.templates_info.in_meeting_template_id};
                    this.getSelectedItem(temp_info,'update');
                  }else{
                    var default_temp_info = { "id" : '1'};
                    this.getSelectedItem(default_temp_info,'update');
                  }
                  
                }
              }
            },
            (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
              
            }
          );
    // To list meeting templates in dropdown
    this.meetingContentService.listMeetingTemplates(info)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.templateLists = response.body;
                console.log(this.templateLists)
              }
            },
            (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
              
            }
          );
      // To list the default audios in dropdown
      this.meetingContentService.listDefaultAudios(this.token)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.defaultAudios = response.body;
                console.log(this.defaultAudios)
              }
            },
            (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
              
            }
          );

          
  }

  // To get the details of template when we select a template from dropdown
  getSelectedItem(item,medium){
    if(medium == 'drop'){
      this.selectedOption  = item.title;
    }

    this.template_id     = item.id;
    this.logo            = "";
    var params = {"token": this.token ,"template_id" : item.id,'meeting_id':this.meetingId }
    if(this.selectedOption == 'No Template' || medium == 'drop'){
         // To save the the template for a particular meeting while selcting template from dropdown
        this.meetingContentService.saveMeetingTemplateInfo(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
          }
        },
        (error) => { 
         
          error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
              
          
          
        }
      );
    
    }
     // To get the details of template when we select a template from dropdown
    this.meetingContentService.getTemplateInfo(params)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.templateDetails = response.body;
                console.log(this.templateDetails)
                if(this.templateDetails !== {} && this.templateDetails.length !== 0){
                  this.selectedOption       = this.templateDetails.title;
                  if(this.selectedOption == "No Template"){
                  
                    this.noTemplate = true;
                  }else{
                    this.noTemplate = false;
                  }
                  this.logo                 = this.templateDetails.logo;
                  this.check_audio_type     = parseInt(this.templateDetails.audio_type);
                  var logo_path             = this.logo;
                  //this.upload_image_name    = logo_path.substr(logo_path.lastIndexOf('/') + 1);
                  if(this.check_audio_type == 1){
                    this.selctedAudio       = this.templateDetails.audio_title;
                    this.customAudio        = '';
                    this.savedCustomAudio   = "";
                    this.hideDefaultAudioSection =false;
                    //this.customAudio    = this.selctedAudio;
                  }else{
                    this.selctedAudio       = '';
                    var aud_file            = this.templateDetails.filename;
                    this.final_name         = aud_file.substr(aud_file.lastIndexOf('/') + 1);
                    this.savedCustomAudio   = this.final_name;
                    this.hideCustomAudioSection =false;
                  }
                  this.audio_filepath = this.templateDetails.filename;
                  var audio         = {'id' : this.templateDetails.audio_id,'title':this.templateDetails.audio_title};
                  this.getSelectedAudio(audio);
                }else{
                    var default_temp_info = { "id" : '1'};
                    this.getSelectedItem(default_temp_info,'update');
                }
              }
            },
            (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
              
            }
          );

          
  }

  getSelectedAudio(audio){
    this.selctedAudio = audio.title;
    this.audio_id     = audio.id;
    console.log(this.audio_id);
  }

  onSubmit(event,meetingContent:NgForm){
    console.log(meetingContent.value);
    if(this.noTemplate){
        //var randomString          = this.makeid();
        let formData:FormData     = new FormData();
        this.details.token        = this.token;
        this.details.meeting_id   = this.meetingId;
        this.details.title        = this.selectedOption;
        this.details.template_id  = this.template_id;
        if(meetingContent.value.audio_type == '1'){
            this.details.audio_type = 1;
            this.savedCustomAudio = "";
            console.log('aud'+this.audio_id)
            if(this.audio_id == '' || this.audio_id == 0){
                this.errorCount++;
                this.select_audio_error   = "Please choose audio.";
            }else{
                this.errorCount = 0;
                this.details.audio_id   = this.audio_id;
                this.select_audio_error   = "";
            }
            this.hideDefaultAudioSection = false;
        
        }else{
            this.hideDefaultAudioSection = true;
            console.log('cusaud'+this.savedCustomAudio)
            this.details.audio_type = 2;
            this.audio_id           = "";
            if(this.savedCustomAudio =="" && this.customAudio == ""){
                this.upload_error_message ="Please upload an audio";
                this.errorCount++;
            }else{
                this.upload_error_message ="";
                this.errorCount = 0;
            }
        }
        formData.append('details', JSON.stringify(this.details));
        if(this.logo_file){
            formData.append('logo', this.logo_file[0]); 
        }
        if(this.mp3_file){
            formData.append('audio_file', this.mp3_file[0]); 
        }
        
        if(this.errorCount == 0){
          this.save_template = true;
           // To save the details of No Template
          this.meetingContentService.saveTemplateInfo(formData).subscribe(
              (response:any) => {
                this.save_template = false;
                response = JSON.parse(response['_body']);
                if(response.success == 1){
                  this.selectedOption = this.details.title;
                  if(this.selectedOption != 'No Template'){
                    this.noTemplate     = false;
                  }
                  if(response.body.custom_audio_file){
                    this.audio_filepath   = response.body.custom_audio_file;
                    this.savedCustomAudio = this.audio_filepath.substr(this.audio_filepath.lastIndexOf('/') + 1);
                    this.hideDefaultAudioSection = false;
                  }
                  this.customAudio == ""
                  
                  // let template:any    = {};
                  // template.id         = response.body.template_id;
                  // template.title      = this.details.title;
                  // this.templateLists.push(template);
                  this.showSuccess(response.message);
                  this.logo_error     = "";
                  this.audio_error    = "";
                }
              },
              (error) => { 
                this.save_template = false;
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/');
                  this.showError(error.message);
                }
                if(!error.message.logo_err && !error.message.audio_err){
                  this.showError(error.message);
                }else{
                  //this.showError('We cannot save invalid inputs !');
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
  // To read the files and performs file validation
  getFiles(event,type){
    if(event.target.files) {
      this.files = event.target.files; 
      if(type == 'image'){ console.log('dfsdfgfsdg');
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
              
          }else{
              this.logo_error = "Allowed image types are jpg | png | jpeg";
              this.logo       = "";
              this.upload_image_name = "";
          } 
         
      }else{
          this.mp3_file               = this.files;
          let aud_filename            = this.mp3_file[0].name;
          var allowedAudioExtensions  = ["mp3","wav"];
          this.fileExtension          = aud_filename.split('.').pop();
          let check                   = allowedAudioExtensions.filter(x => x == this.fileExtension);
          if(check.length !== 0){
              this.audio_error        = '';
              this.customAudio        = aud_filename;
          }else{
              this.audio_error        = "Allowed audio types are mp3 | wav";
              this.customAudio        = "";
          }
      }
    }
      
  }

  ImageClick(){
    if(!this.noTemplate){
      this.showError('You cannot Edit this template');
    }
  }
  defaultClick(){
    if(!this.noTemplate){
      this.showError('You cannot Edit this template');
    }
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
   makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < 3; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


  

}
